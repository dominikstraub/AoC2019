(async () => {
    const startTime = performance.now();

    const dsnDecoder = (data, rows, cols) => {
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

        for (let colI = 0; colI < image[0][0].length; colI++) {
            renderedImage[colI] = [];
            for (let rowI = 0; rowI < image[0].length; rowI++) {
                renderedImage[colI][rowI] = null;
                for (let layerI = 0; layerI < image.length; layerI++) {
                    if (renderedImage[colI][rowI] === null || renderedImage[colI][rowI] === 2) {
                        renderedImage[colI][rowI] =
                            image[layerI][rowI][colI] === 1
                                ? '#'
                                : image[layerI][rowI][colI] === 0
                                ? ' '
                                : image[layerI][rowI][colI];
                    } else {
                        break;
                    }
                }
            }
        }

        return renderedImage;
    };

    const response = await fetch('./input.json');
    // const response = await fetch('./test.json');
    // const response = await fetch('./test2.json');
    const { data, width, height } = await response.json();
    // console.log(input);

    const { image, checksum } = dsnDecoder(data, width, height);
    console.log(checksum, image);

    const renderedImage = render(image);
    console.log(renderedImage);

    console.log('execution time', performance.now() - startTime);
})();
