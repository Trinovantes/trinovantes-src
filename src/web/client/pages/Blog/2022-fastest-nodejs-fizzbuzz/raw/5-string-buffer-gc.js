const MAX = 0x7FFFFFFFFFFFFFFFn
const BUFFER_SIZE = 32 * 1024
const NODE_HEAP_SIZE = 1024 * 1024 * 1024 // 1GB
const PRINTS_BETWEEN_GC = NODE_HEAP_SIZE / BUFFER_SIZE / 2 / 2 // Each str has 2 copies

function fizzbuzz() {
    let buffer = ''
    let printsSinceLastGc = 0

    for (let i = 0n; i < MAX; i += 15n) {
        buffer += `${i + 1n}\n${i + 2n}\nFizz\n${i + 4n}\nBuzz\nFizz\n${i + 7n}\n${i + 8n}\nFizz\nBuzz\n${i + 11n}\nFizz\n${i + 13n}\n${i + 14n}\nFizzBuzz\n`

        if (buffer.length > BUFFER_SIZE) {
            process.stdout.write(buffer, 'ascii')
            buffer = ''
            printsSinceLastGc++

            if (printsSinceLastGc >= PRINTS_BETWEEN_GC) {
                printsSinceLastGc = 0
                global.gc()
            }
        }
    }
}

fizzbuzz()
