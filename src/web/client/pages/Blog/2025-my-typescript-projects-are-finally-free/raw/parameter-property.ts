class Foo {
    constructor(
        // Not possible with erasableSyntaxOnly
        private a: number,
        private b: number,
        private c: number,
    ) {
        console.log(a, b, c)
    }
}
