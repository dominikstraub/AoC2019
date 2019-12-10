(async () => {
    const startTime = performance.now();

    const analyzeMap = map => {
        let xA = null;
        let yA = null;
        let count = 0;
        // compare every asteroid...
        for (let y1 = 0; y1 < map.length; y1++) {
            for (let x1 = 0; x1 < map.length; x1++) {
                const pos1 = map[y1][x1];
                if (pos1 === '#') {
                    // ...with every other asteroid...
                    let curCount = 0;
                    for (let y2 = 0; y2 < map.length; y2++) {
                        for (let x2 = 0; x2 < map.length; x2++) {
                            const pos2 = map[y2][x2];
                            if (pos2 === '#' && !(x1 === x2 && y1 === y2)) {
                                // ... to check if another asteroid is in between them
                                let slope = (y1 - y2) / (x1 - x2);
                                if (slope === Number.POSITIVE_INFINITY) {
                                    for (let y = y1 - 1; y >= 0; y--) {
                                        if (map[y][x1] === '#') {
                                            curCount++;
                                            break;
                                        }
                                    }
                                    for (let y = y1 + 1; y < map.length; y++) {
                                        if (map[y][x1] === '#') {
                                            curCount++;
                                            break;
                                        }
                                    }
                                } else {
                                    for (let x = Math.min(x1, x2) + 1; x < Math.max(x1, x2); x++) {
                                        const y = y1 + slope * x;
                                        if (y >= 0 && y < map.length && Number.isInteger(y) && map[y][x] === '#') {
                                            curCount++;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (curCount > count) {
                        count = curCount;
                        xA = x1;
                        yA = y1;
                    }
                }
            }
        }

        return { position: [xA, yA], asteroids: count };
    };

    const run = async inputPath => {
        const response = await fetch(inputPath);
        const { data, positionCheck, asteroidsCheck } = await response.json();
        console.log(data);

        const { position, asteroids } = analyzeMap(data);
        console.log('positionX', position[0] === positionCheck[0]);
        console.log('positionY', position[1] === positionCheck[1]);
        console.log('asteroids', asteroids === asteroidsCheck);
    };

    await run('./test.json');
    // await run('./test2.json');
    // await run('./test3.json');
    // await run('./input.json');

    console.log('execution time', performance.now() - startTime);
})();
