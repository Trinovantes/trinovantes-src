const MAX = 0x7FFFFFFFFFFFFFFFn

function fizzbuzz() {
    for (let i = 0n; i < MAX; i += 15n) {
        process.stdout.write(`${i + 1n}\n${i + 2n}\nFizz\n${i + 4n}\nBuzz\nFizz\n${i + 7n}\n${i + 8n}\nFizz\nBuzz\n${i + 11n}\nFizz\n${i + 13n}\n${i + 14n}\nFizzBuzz\n`)
    }
}

fizzbuzz()
