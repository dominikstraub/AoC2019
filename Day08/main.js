(async () => {
    const startTime = performance.now();

    const dsnDecoder = (data, cols, rows) => {
        const image = [];

        let fevestZeros = null;
        let checksum = null;
        for (let i = 0, layerI = 0; i < data.length; layerI++) {
            image[layerI] = [];
            const layer = image[layerI];
            const digitCounts = [0, 0, 0];
            for (let rowI = 0; rowI < rows; rowI++) {
                layer[rowI] = [];
                const row = layer[rowI];
                for (let colI = 0; colI < cols; colI++) {
                    row[colI] = Number.parseInt(data[i++], 10);
                    digitCounts[row[colI]]++;
                }
            }
            if (!fevestZeros || digitCounts[0] < fevestZeros) {
                fevestZeros = digitCounts[0];
                checksum = digitCounts[1] * digitCounts[2];
            }
        }

        return { image, checksum };
    };

    const render = image => {
        const renderedImage = [];

        for (let rowI = 0; rowI < image[0].length; rowI++) {
            renderedImage[rowI] = [];
            for (let colI = 0; colI < image[0][0].length; colI++) {
                renderedImage[rowI][colI] = null;
                for (let layerI = 0; layerI < image.length; layerI++) {
                    if (renderedImage[rowI][colI] !== null && renderedImage[rowI][colI] !== 2) {
                        break;
                    }
                    renderedImage[rowI][colI] = image[layerI][rowI][colI];
                }
            }
        }

        return renderedImage;
    };

    const drawCanvas = image => {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', image[0].length * size);
        canvas.setAttribute('height', image.length * size);
        const body = document.getElementsByTagName('body')[0];
        body.append(canvas);
        body.append(document.createElement('br'));

        const ctx = canvas.getContext('2d');

        for (let row = image.length - 1; row >= 0; row--) {
            for (let col = image[0].length - 1; col >= 0; col--) {
                if (image[row][col] === 0) {
                    ctx.fillStyle = 'black';
                } else if (image[row][col] === 1) {
                    ctx.fillStyle = 'white';
                }
                ctx.fillRect(col * size, row * size, size, size);
            }
        }
    };

    const run = async inputPath => {
        const response = await fetch(inputPath);
        const { data, width, height } = await response.json();

        const { image, checksum } = dsnDecoder(data, width, height);
        console.log(checksum, image);

        const renderedImage = render(image);
        console.log(renderedImage);

        drawCanvas(renderedImage);
    };

    // await run('./test.json');
    // await run('./test2.json');
    await run('./input.json');

    console.log('execution time', performance.now() - startTime);
})();
