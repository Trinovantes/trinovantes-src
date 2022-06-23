const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

const MAX = 0x7FFFFFFFFFFFFFFFn
const BUFFER_SIZE = 64 * 1024

const MAX_DECIMALS = 19 // 19 max bytes (decimal places) for 2^63-1
const BASE10 = [...Array(MAX_DECIMALS + 1).keys()].map((i) => 10n ** BigInt(i))

const FIZZ_BUZZ_PER_CYCLE = (15 / 3) + (15 / 5)
const INT_PER_CYCLE = 15 - FIZZ_BUZZ_PER_CYCLE
const BYTES_PER_CYCLE = (FIZZ_BUZZ_PER_CYCLE * 4) + (INT_PER_CYCLE * MAX_DECIMALS) // 4 bytes for 'fizz' and 'buzz'',
const CYCLES = Math.floor(BUFFER_SIZE / BYTES_PER_CYCLE)
const INTS_PER_CYCLE = BigInt(CYCLES) * 15n

const THREADS = 12

function fizzbuzz() {
    if (isMainThread) {
        const sharedStrBuffer = new SharedArrayBuffer(THREADS * BUFFER_SIZE)
        const sharedCanConsumeBuffer = new SharedArrayBuffer(THREADS * Int32Array.BYTES_PER_ELEMENT)
        const sharedCanProduceBuffer = new SharedArrayBuffer(THREADS * Int32Array.BYTES_PER_ELEMENT)

        const strBuffer = new Uint8Array(sharedStrBuffer)
        const canConsume = new Int32Array(sharedCanConsumeBuffer) // when non-zero, it stores the position of the last character
        const canProduce = new Int32Array(sharedCanProduceBuffer) // when non-zero, worker thread can work

        const workers = []
        for (let threadId = 0; threadId < THREADS; threadId++) {
            canConsume[threadId] = 0
            canProduce[threadId] = 1

            const worker = new Worker(__filename, {
                workerData: {
                    threadId,
                    sharedStrBuffer,
                    sharedCanConsumeBuffer,
                    sharedCanProduceBuffer,
                }
            })

            workers.push(worker)
        }

        const step = INTS_PER_CYCLE * BigInt(THREADS)
        for (let i = 0n; i < MAX; i += step) {
            for (let threadId = 0; threadId < THREADS; threadId++) {
                Atomics.wait(canConsume, threadId, 0)

                const offsetStart = threadId * BUFFER_SIZE
                const offsetEnd = Atomics.load(canConsume, threadId)
                process.stdout.write(strBuffer.subarray(offsetStart, offsetEnd), 'ascii')

                Atomics.store(canProduce, threadId, 1)
                Atomics.notify(canProduce, threadId)
            }
        }
    } else {
        const { threadId } = workerData

        const strBuffer = new Uint8Array(workerData.sharedStrBuffer)
        const canConsume = new Int32Array(workerData.sharedCanConsumeBuffer)
        const canProduce = new Int32Array(workerData.sharedCanProduceBuffer)

        const initOffset = threadId * BUFFER_SIZE
        let offset = initOffset

        const writeFizz = () => {
            strBuffer[offset + 0] = 0x46
            strBuffer[offset + 1] = 0x69
            strBuffer[offset + 2] = 0x7a
            strBuffer[offset + 3] = 0x7a

            strBuffer[offset + 4] = 0x0a
            offset += 5
        }

        const writeBuzz = () => {
            strBuffer[offset + 0] = 0x42
            strBuffer[offset + 1] = 0x75
            strBuffer[offset + 2] = 0x7a
            strBuffer[offset + 3] = 0x7a

            strBuffer[offset + 4] = 0x0a
            offset += 5
        }

        const writeFizzBuzz = () => {
            strBuffer[offset + 0] = 0x46
            strBuffer[offset + 1] = 0x69
            strBuffer[offset + 2] = 0x7a
            strBuffer[offset + 3] = 0x7a

            strBuffer[offset + 4] = 0x42
            strBuffer[offset + 5] = 0x75
            strBuffer[offset + 6] = 0x7a
            strBuffer[offset + 7] = 0x7a

            strBuffer[offset + 8] = 0x0a
            offset += 9
        }

        // Works between 1 to 2^63-1
        const writeBigInt = (n) => {
            let hasLeading = false

            for (let exp = MAX_DECIMALS; exp >= 0; exp--) {
                const divisor = BASE10[exp]

                if (n >= divisor) {
                    const digit = n / divisor
                    n = n % divisor

                    strBuffer[offset] = 0x30 + Number(digit)
                    offset += 1
                    hasLeading = true
                } else if (hasLeading) {
                    strBuffer[offset] = 0x30
                    offset += 1
                }
            }

            strBuffer[offset] = 0x0a
            offset += 1
        }

        const intsPerGlobalCycle = INTS_PER_CYCLE * BigInt(THREADS)
        const totalCycles = (MAX / intsPerGlobalCycle) + 1n

        for (let c = 0n; c < totalCycles; c++) {
            Atomics.wait(canProduce, threadId, 0)
    
            const startInt = (c * intsPerGlobalCycle) + (BigInt(threadId) * INTS_PER_CYCLE)
            const endInt = (startInt + INTS_PER_CYCLE > MAX)
                ? MAX
                : startInt + INTS_PER_CYCLE

            for (let i = startInt; i < endInt; i += 15n) {
                writeBigInt(i + 1n)
                writeBigInt(i + 2n)
                writeFizz()
                writeBigInt(i + 4n)
                writeBuzz()
                writeFizz()
                writeBigInt(i + 7n)
                writeBigInt(i + 8n)
                writeFizz()
                writeBuzz()
                writeBigInt(i + 11n)
                writeFizz()
                writeBigInt(i + 13n)
                writeBigInt(i + 14n)
                writeFizzBuzz()
            }

            Atomics.store(canConsume, threadId, offset)
            Atomics.notify(canConsume, threadId)
            offset = initOffset

            Atomics.store(canProduce, threadId, 0)
        }
    }
}

fizzbuzz()
