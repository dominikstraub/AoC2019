(async () => {
    const makeGen = function*() {
        for (let i = 0; i < 10; i++) {
            yield i;
        }
    };

    const gen = makeGen();
    for (let current = gen.next(); !current.done; current = gen.next()) {
        console.log(current.value);
    }
})();
