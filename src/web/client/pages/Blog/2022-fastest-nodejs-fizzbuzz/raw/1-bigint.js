const MAX = 0x7FFFFFFFFFFFFFFFn

function fizzbuzz() {
    for (let i = 1n; i <= MAX; i++) {
        if ((i % 3n === 0n) && (i % 5n === 0n)) {
            console.log('FizzBuzz')
        } else if (i % 3n === 0n) {
            console.log('Fizz')
        } else if (i % 5n === 0n) {
            console.log('Buzz')
        } else {
            console.log(i)
        }
    }
}

fizzbuzz()
