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
                for (let col = 0; col < cols; col++) {
                    row[col] = Number.parseInt(data[i++], 10);
                    digitCounts[row[col]]++;
                }
            }
            if (!fevestZeros || digitCounts[0] < fevestZeros) {
                fevestZeros = digitCounts[0];
                checksum = digitCounts[1] * digitCounts[2];
            }
        }

        return { image, checksum };
    };

    const response = await fetch('./input.json');
    // const response = await fetch('./test.json');
    const { data, width, height } = await response.json();
    // console.log(input);

    const { image, checksum } = dsnDecoder(data, width, height);
    console.log(checksum, image);

    console.log('execution time', performance.now() - startTime);
})();
