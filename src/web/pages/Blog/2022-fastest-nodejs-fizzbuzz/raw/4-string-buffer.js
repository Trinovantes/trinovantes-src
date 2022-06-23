const MAX = 0x7FFFFFFFFFFFFFFFn
const BUFFER_SIZE = 32 * 1024

function fizzbuzz() {
    let buffer = ''

    for (let i = 0n; i < MAX; i += 15n) {
        buffer += `${i + 1n}\n${i + 2n}\nFizz\n${i + 4n}\nBuzz\nFizz\n${i + 7n}\n${i + 8n}\nFizz\nBuzz\n${i + 11n}\nFizz\n${i + 13n}\n${i + 14n}\nFizzBuzz\n`

        if (buffer.length > BUFFER_SIZE) {
            process.stdout.write(buffer)
            buffer = ''
        }
    }
}

fizzbuzz()
