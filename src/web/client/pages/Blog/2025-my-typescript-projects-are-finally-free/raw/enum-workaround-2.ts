// If you need to access the values at runtime

const STATUS_VALUES = [
    'READY',
    'ERROR',
] as const

type Status = typeof STATUS_VALUES[number]

for (const val of STATUS_VALUES) {
    console.log(val)
}
