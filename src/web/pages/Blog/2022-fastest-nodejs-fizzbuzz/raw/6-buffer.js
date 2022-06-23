const MAX = 0x7FFFFFFFFFFFFFFFn
const BUFFER_SIZE = 64 * 1024

const MAX_DECIMALS = 19 // 19 max bytes (decimal places) for 2^63-1
const BASE10 = [...Array(MAX_DECIMALS + 1).keys()].map((i) => 10n ** BigInt(i))

const FIZZ_BUZZ_PER_CYCLE = (15 / 3) + (15 / 5)
const INT_PER_CYCLE = 15 - FIZZ_BUZZ_PER_CYCLE
const BYTES_PER_CYCLE = (FIZZ_BUZZ_PER_CYCLE * 4) + (INT_PER_CYCLE * MAX_DECIMALS) // 4 bytes for 'fizz' and 'buzz'', 
const CYCLES = Math.floor(BUFFER_SIZE / BYTES_PER_CYCLE)

function fizzbuzz() {
    const buffer = Buffer.alloc(BYTES_PER_CYCLE * CYCLES)
    let offset = 0

    const writeFizz = () => {
        buffer.writeUInt32BE(0x46697a7a, offset)
        offset += 4
        buffer.writeUint8(0x0a, offset)
        offset += 1
    }

    const writeBuzz = () => {
        buffer.writeUInt32BE(0x42757a7a, offset)
        offset += 4
        buffer.writeUint8(0x0a, offset)
        offset += 1
    }

    const writeFizzBuzz = () => {
        buffer.writeUInt32BE(0x46697a7a, offset)
        offset += 4
        buffer.writeUInt32BE(0x42757a7a, offset)
        offset += 4
        buffer.writeUint8(0x0a, offset)
        offset += 1
    }

    // Works between 1 to 2^63-1
    const writeBigInt = (n) => {
        let hasLeading = false

        for (let exp = MAX_DECIMALS; exp >= 0; exp--) {
            const divisor = BASE10[exp]

            if (n >= divisor) {
                const digit = n / divisor
                n = n % divisor

                buffer.writeUint8(0x30 + Number(digit), offset)
                offset += 1
                hasLeading = true
            } else if (hasLeading) {
                buffer.writeUint8(0x30, offset)
                offset += 1
            }
        }

        buffer.writeUint8(0x0a, offset)
        offset += 1
    }

    const printAndResetBuffer = () => {
        process.stdout.write(buffer.subarray(0, offset), 'ascii')
        offset = 0
    }

    for (let i = 0n, cycles = 0; i < MAX; i += 15n, cycles += 1) {
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

        if (cycles >= CYCLES) {
            printAndResetBuffer()
            cycles = 0
        }
    }

    printAndResetBuffer()
}

fizzbuzz()
