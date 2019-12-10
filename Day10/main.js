(async () => {
    const startTime = performance.now();

    const analyzeMap = map => {
        let xA = null;
        let yA = null;
        let count = 0;
        const counts = [];
        // compare every asteroid...
        for (let y1 = 0; y1 < map.length; y1++) {
            for (let x1 = 0; x1 < map[y1].length; x1++) {
                const pos1 = map[y1][x1];
                let curCount = 0;
                if (pos1 === '#') {
                    // ...with every other asteroid...
                    const slopes = [];
                    console.log(map);
                    for (let y2 = 0; y2 < map.length; y2++) {
                        for (let x2 = 0; x2 < map[y2].length; x2++) {
                            const pos2 = map[y2][x2];
                            if (pos2 === '#' && !(x1 === x2 && y1 === y2)) {
                                // ... to check if another asteroid is in between them
                                // console.log('compare');
                                let slope = (y1 - y2) / (x1 - x2);
                                if (slopes.includes(slope)) {
                                    continue;
                                }
                                slopes.push(slope);
                                if (x1 === x2) {
                                    if (y1 < y2) {
                                        for (let y = y1 + 1; y <= y2; y++) {
                                            if (map[y][x1] === '#') {
                                                curCount++;
                                                console.log('down');
                                                break;
                                            }
                                        }
                                    } else if (slope === Number.NEGATIVE_INFINITY) {
                                        for (let y = y1 - 1; y >= y2; y--) {
                                            if (map[y][x1] === '#') {
                                                curCount++;
                                                console.log('up');
                                                break;
                                            }
                                        }
                                    }
                                } else {
                                    if (x1 < x2) {
                                        for (let x = x1 + 1; x <= x2; x++) {
                                            const y = y1 + slope * (x - x1);
                                            if (y >= 0 && y < map.length && Number.isInteger(y) && map[y][x] === '#') {
                                                curCount++;
                                                console.log('right', 'sloap:', slope);
                                                break;
                                            }
                                        }
                                    } else {
                                        for (let x = x1 - 1; x >= x2; x--) {
                                            const y = y1 + slope * (x - x1);
                                            if (y >= 0 && y < map.length && Number.isInteger(y) && map[y][x] === '#') {
                                                curCount++;
                                                console.log('left', 'sloap:', slope);
                                                break;
                                            }
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
                if (!counts[y1]) {
                    counts[y1] = [];
                }
                counts[y1][x1] = curCount;

                // if (x1 === 1 && y1 === 2) {
                //     return;
                // }
            }
        }

        console.log(counts);

        return { position: [xA, yA], asteroids: count };
    };

    const run = async inputPath => {
        const response = await fetch(inputPath);
        const { data, positionCheck, asteroidsCheck } = await response.json();
        console.log(data);

        const { position, asteroids } = analyzeMap(data);
        console.log(position);
        console.log(asteroids);
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
