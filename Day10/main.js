(async () => {
    const startTime = performance.now();

    let ctx = null;

    const drawCanvas = (map, shots) => {
        const size = 32;
        if (!ctx) {
            const canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'mainCanvas');
            canvas.setAttribute('width', map[0].length * size + size * 2);
            canvas.setAttribute('height', map.length * size + size * 2);
            const body = document.getElementsByTagName('body')[0];
            body.append(canvas);
            body.append(document.createElement('br'));
            ctx = canvas.getContext('2d');
        }

        ctx.fillStyle = 'grey';
        ctx.fillRect(0, 0, map[0].length * size + size * 2, map[0].length * size + size * 2);
        for (let row = map.length - 1; row >= 0; row--) {
            for (let col = map[0].length - 1; col >= 0; col--) {
                const color = map[row][col];
                if (color) {
                    ctx.fillStyle = map[row][col];
                } else {
                    ctx.fillStyle = 'white';
                }
                ctx.fillRect(size + col * size, size + row * size, size, size);
            }
        }

        for (let row = map.length - 1; row >= 0; row--) {
            for (let col = map[0].length - 1; col >= 0; col--) {
                const shot = shots[row][col];
                if (!shot) {
                    continue;
                }
                ctx.strokeStyle = 'grey';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(size + shot.source[1] * size + size / 2, size + shot.source[0] * size + size / 2);
                ctx.lineTo(size + col * size + size / 2, size + row * size + size / 2);
                ctx.stroke();
            }
        }
        for (let row = map.length - 1; row >= 0; row--) {
            for (let col = map[0].length - 1; col >= 0; col--) {
                const shot = shots[row][col];
                if (!shot) {
                    continue;
                }
                ctx.strokeStyle = shot.color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(size + shot.source[1] * size + size / 2, size + shot.source[0] * size + size / 2);
                ctx.lineTo(size + col * size + size / 2, size + row * size + size / 2);
                ctx.stroke();
            }
        }

        // TODO: make legend
        // black: asteroid
        // green: checked asteroid
        // red: checked & visible asteroid
        // orange: visible asteroid while checking a green one
        // white: empty space
        // grey: border
        // ctx.font = '48px serif';
        // ctx.fillText('Hello world', 10, 50);
    };

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
                    const drawMap = [];
                    const shots = [];
                    for (let i = map.length - 1; i >= 0; i--) {
                        drawMap[i] = [];
                        shots[i] = [];
                    }
                    drawMap[y1][x1] = 'blue';
                    // ...against every other asteroid...
                    const leftSlopes = [];
                    const rightSlopes = [];
                    for (let y2 = 0; y2 < map.length; y2++) {
                        for (let x2 = 0; x2 < map[y2].length; x2++) {
                            const pos2 = map[y2][x2];
                            if (pos2 === '#' && !(x1 === x2 && y1 === y2)) {
                                // ... to check if another asteroid is in between them
                                if (!drawMap[y2][x2]) {
                                    drawMap[y2][x2] = 'black';
                                }

                                const slope = (y1 - y2) / (x1 - x2);

                                if (x1 === x2) {
                                    if (y1 < y2) {
                                        if (!rightSlopes.includes(slope)) {
                                            drawMap[y2][x2] = 'green';
                                            shots[y2][x2] = { color: 'green', source: [y1, x1] };
                                            rightSlopes.push(slope);
                                            for (let y = y1 + 1; y <= y2; y++) {
                                                if (map[y][x1] === '#') {
                                                    if (y === y2) {
                                                        drawMap[y][x1] = 'red';
                                                        shots[y][x1] = { color: 'red', source: [y1, x1] };
                                                    } else {
                                                        drawMap[y][x1] = 'orange';
                                                        shots[y][x1] = { color: 'orange', source: [y1, x1] };
                                                    }
                                                    curCount++;
                                                    break;
                                                }
                                            }
                                        } else {
                                            // drawMap[y2][x2] = 'lightgreen';
                                            // shots[y2][x2] = { color: 'lightgreen', source: [y1, x1] };
                                        }
                                    } else {
                                        if (!leftSlopes.includes(slope)) {
                                            drawMap[y2][x2] = 'green';
                                            shots[y2][x2] = { color: 'green', source: [y1, x1] };
                                            leftSlopes.push(slope);
                                            for (let y = y1 - 1; y >= y2; y--) {
                                                if (map[y][x1] === '#') {
                                                    if (y === y2) {
                                                        drawMap[y][x1] = 'red';
                                                        shots[y][x1] = { color: 'red', source: [y1, x1] };
                                                    } else {
                                                        drawMap[y][x1] = 'orange';
                                                        shots[y][x1] = { color: 'orange', source: [y1, x1] };
                                                    }
                                                    curCount++;
                                                    break;
                                                }
                                            }
                                        } else {
                                            // drawMap[y2][x2] = 'lightgreen';
                                            // shots[y2][x2] = { color: 'lightgreen', source: [y1, x1] };
                                        }
                                    }
                                } else {
                                    if (x1 < x2) {
                                        if (!rightSlopes.includes(slope)) {
                                            drawMap[y2][x2] = 'green';
                                            shots[y2][x2] = { color: 'green', source: [y1, x1] };
                                            rightSlopes.push(slope);
                                            for (let x = x1 + 1; x <= x2; x++) {
                                                const y = y1 + slope * (x - x1);
                                                if (
                                                    y >= 0 &&
                                                    y < map.length &&
                                                    Number.isInteger(y) &&
                                                    map[y][x] === '#'
                                                ) {
                                                    if (y === y2 && x === x2) {
                                                        drawMap[y][x] = 'red';
                                                        shots[y][x] = { color: 'red', source: [y1, x1] };
                                                    } else {
                                                        drawMap[y][x] = 'orange';
                                                        shots[y][x] = { color: 'orange', source: [y1, x1] };
                                                    }
                                                    curCount++;
                                                    break;
                                                }
                                            }
                                        } else {
                                            // drawMap[y2][x2] = 'lightgreen';
                                            // shots[y2][x2] = { color: 'lightgreen', source: [y1, x1] };
                                        }
                                    } else {
                                        if (!leftSlopes.includes(slope)) {
                                            drawMap[y2][x2] = 'green';
                                            shots[y2][x2] = { color: 'green', source: [y1, x1] };
                                            leftSlopes.push(slope);
                                            for (let x = x1 - 1; x >= x2; x--) {
                                                const y = y1 + slope * (x - x1);
                                                if (
                                                    y >= 0 &&
                                                    y < map.length &&
                                                    Number.isInteger(y) &&
                                                    map[y][x] === '#'
                                                ) {
                                                    if (y === y2 && x === x2) {
                                                        drawMap[y][x] = 'red';
                                                        shots[y][x] = { color: 'red', source: [y1, x1] };
                                                    } else {
                                                        drawMap[y][x] = 'orange';
                                                        shots[y][x] = { color: 'orange', source: [y1, x1] };
                                                    }
                                                    curCount++;
                                                    break;
                                                }
                                            }
                                        } else {
                                            // drawMap[y2][x2] = 'lightgreen';
                                            // shots[y2][x2] = { color: 'lightgreen', source: [y1, x1] };
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (x1 === 20 && y1 === 19) {
                        // debugger;
                        drawCanvas(drawMap, shots);
                        // return;
                    }
                    if (curCount > count) {
                        // drawCanvas(drawMap, shots);
                        count = curCount;
                        xA = x1;
                        yA = y1;
                    }
                }
                if (!counts[y1]) {
                    counts[y1] = [];
                }
                counts[y1][x1] = curCount.toString().padStart(3, 0);
            }
        }

        console.log(counts);
        return { position: [xA, yA], asteroids: count };
    };

    const run = async inputPath => {
        const response = await fetch(inputPath);
        const { data, positionCheck, asteroidsCheck } = await response.json();
        // console.log(data);

        const { position, asteroids } = analyzeMap(data);
        console.log(position);
        console.log(asteroids);
        if (asteroidsCheck) {
            console.log('positionX', position[0] === positionCheck[0]);
            console.log('positionY', position[1] === positionCheck[1]);
            console.log('asteroids', asteroids === asteroidsCheck);
        }
    };

    // await run('./test.json');
    // await run('./test2.json');
    // await run('./test3.json');
    await run('./input.json');

    console.log('execution time', performance.now() - startTime);
})();
