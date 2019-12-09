(async () => {
    const startTime = performance.now();

    const intcode = (data, readInput, index = 0) => {
        let readInputIndex = 0;
        let base = 0;

        while (true) {
            const instruction = data[index];
            const opcode = instruction % 100;
            const p1mode = Math.floor(instruction / 100) % 10;
            const p2mode = Math.floor(instruction / 1000) % 10;
            const p3mode = Math.floor(instruction / 10000) % 10;

            let p1address = index + 1;
            if (p1mode === 0) {
                p1address = data[p1address];
            }
            if (p1mode === 2) {
                p1address = base + data[p1address];
            }

            let p2address = index + 2;
            if (p2mode === 0) {
                p2address = data[p2address];
            }
            if (p2mode === 2) {
                p2address = base + data[p2address];
            }

            let p3address = index + 3;
            if (p3mode === 0) {
                p3address = data[p3address];
            }
            if (p3mode === 2) {
                p3address = base + data[p3address];
            }

            switch (opcode) {
                case 1:
                    data[p3address] = data[p1address] + data[p2address];
                    index += 4;
                    break;
                case 2:
                    data[p3address] = data[p1address] * data[p2address];
                    index += 4;
                    break;
                case 3:
                    if (readInputIndex >= readInput.length) {
                        readInputIndex = readInput.length - 1;
                    }
                    data[p1address] = readInput[readInputIndex++];
                    index += 2;
                    break;
                case 4:
                    index += 2;
                    console.log(data[p1address]);
                    break;
                case 5:
                    if (data[p1address] !== 0) {
                        index = data[p2address];
                    } else {
                        index += 3;
                    }
                    break;
                case 6:
                    if (data[p1address] === 0) {
                        index = data[p2address];
                    } else {
                        index += 3;
                    }
                    break;
                case 7:
                    if (data[p1address] < data[p2address]) {
                        data[p3address] = 1;
                    } else {
                        data[p3address] = 0;
                    }
                    index += 4;
                    break;
                case 8:
                    if (data[p1address] === data[p2address]) {
                        data[p3address] = 1;
                    } else {
                        data[p3address] = 0;
                    }
                    index += 4;
                    break;
                case 9:
                    base += data[p1address];
                    index += 2;
                    break;
                case 99:
                    index += 1;
                    return;
            }
        }
    };

    const run = async inputPath => {
        const response = await fetch(inputPath);
        const { data } = await response.json();
        console.log(data);

        intcode(data, [2]);
    };

    // await run('./test.json');
    // await run('./test2.json');
    // await run('./test3.json');
    await run('./input.json');

    console.log('execution time', performance.now() - startTime);
})();
