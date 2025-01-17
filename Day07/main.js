(async () => {
    const startTime = performance.now();

    const intcode = (data, readInput, index = 0) => {
        let readInputIndex = 0;

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
            let p2address = index + 2;
            if (p2mode === 0) {
                p2address = data[p2address];
            }
            let p3address = index + 3;
            if (p3mode === 0) {
                p3address = data[p3address];
            }
            switch (opcode) {
                case 1:
                    data[data[index + 3]] = data[p1address] + data[p2address];
                    index += 4;
                    break;
                case 2:
                    data[data[index + 3]] = data[p1address] * data[p2address];
                    index += 4;
                    break;
                case 3:
                    if (readInputIndex >= readInput.length) {
                        readInputIndex = readInput.length - 1;
                    }
                    data[data[index + 1]] = readInput[readInputIndex++];
                    index += 2;
                    break;
                case 4:
                    index += 2;
                    return [data[p1address], index];
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
                case 99:
                    index += 1;
                    return [];
            }
        }
    };

    const amplifierController = (software, phases) => {
        let input = 0;
        const softwares = [software.slice(), software.slice(), software.slice(), software.slice(), software.slice()];
        const indices = [0, 0, 0, 0, 0];
        let init = true;
        while (true) {
            let output = input;
            for (let i = 0; i < 5; i++) {
                const input = [output];
                if (init) {
                    input.unshift(phases[i]);
                }
                [output, indices[i]] = intcode(softwares[i], input, indices[i]);
                if (output === Number.POSITIVE_INFINITY) {
                    throw new Error(output);
                }
                if (!output) {
                    break;
                }
            }
            init = false;
            if (!output) {
                break;
            }
            input = output;
        }
        return input;
    };

    const getMaxThrust = software => {
        let maxThrust = null;
        for (let phase0 = 5; phase0 <= 9; phase0++) {
            for (let phase1 = 5; phase1 <= 9; phase1++) {
                if (phase0 === phase1) {
                    continue;
                }
                for (let phase2 = 5; phase2 <= 9; phase2++) {
                    if (phase0 === phase2 || phase1 === phase2) {
                        continue;
                    }
                    for (let phase3 = 5; phase3 <= 9; phase3++) {
                        if (phase0 === phase3 || phase1 === phase3 || phase2 === phase3) {
                            continue;
                        }
                        for (let phase4 = 5; phase4 <= 9; phase4++) {
                            if (phase0 === phase4 || phase1 === phase4 || phase2 === phase4 || phase3 === phase4) {
                                continue;
                            }
                            const phases = [phase0, phase1, phase2, phase3, phase4];
                            const output = amplifierController(software, phases);
                            if (!maxThrust || maxThrust < output) {
                                maxThrust = output;
                            }
                        }
                    }
                }
            }
        }
        return maxThrust;
    };

    const response = await fetch('./input.json');
    // const response = await fetch('./test.json');
    // const response = await fetch('./test2.json');
    // const response = await fetch('./test3.json');
    // const response = await fetch('./test4.json');
    // const response = await fetch('./test5.json');
    const input = (await response.json()).data;
    // console.log(input);

    const output = getMaxThrust(input);
    console.log(output);

    console.log('execution time', performance.now() - startTime);
})();
