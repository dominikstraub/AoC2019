(async () => {
    const startTime = performance.now();

    const run = async inputPath => {
        const response = await fetch(inputPath);
        const { data } = await response.json();
        console.log(data);
    };

    // await run('./test.json');
    // await run('./test2.json');
    // await run('./test3.json');
    await run('./input.json');

    console.log('execution time', performance.now() - startTime);
})();
