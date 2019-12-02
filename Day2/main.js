(() => {
    let intcode = (data, test) => {
        let index = 0;

        let step = () => {
            switch (data[index]) {
                case 1:
                    data[data[index + 3]] = data[data[index + 1]] + data[data[index + 2]];
                    break;
                case 2:
                    data[data[index + 3]] = data[data[index + 1]] * data[data[index + 2]];
                    break;
                case 99:
                    return false;
            }
            index += 4;
            return true;
        };

        for (let i = 0; step() === true; i++) {
            // console.log('step ' + i, data);
        }
        // console.log('result', data[0]);

        // check result
        if (test) {
            for (let i = test.length - 1; i >= 0; i--) {
                if (test[i] !== data[i]) {
                    console.error('expected', test[i], 'actual', data[i]);
                }
            }
        }
    };

    let gravityAssist = data => {
        for (let noun = 0; noun < 100; noun++) {
            for (let verb = 0; verb < 100; verb++) {
                let input = data.slice();
                input[1] = noun;
                input[2] = verb;
                intcode(input);
                if (input[0] === 19690720) {
                    console.log(noun, verb);
                    return;
                }
            }
        }
    };

    // tests
    // intcode([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50], [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    // intcode([1, 0, 0, 0, 99], [2, 0, 0, 0, 99]);
    // intcode([2, 3, 0, 3, 99], [2, 3, 0, 6, 99]);
    // intcode([2, 4, 4, 5, 99, 0], [2, 4, 4, 5, 99, 9801]);
    // intcode([1, 1, 1, 4, 99, 5, 6, 0, 99], [30, 1, 1, 4, 2, 5, 6, 0, 99]);

    // intcode([
    gravityAssist([
        1,
        12,
        2,
        3,
        1,
        1,
        2,
        3,
        1,
        3,
        4,
        3,
        1,
        5,
        0,
        3,
        2,
        1,
        10,
        19,
        1,
        6,
        19,
        23,
        1,
        13,
        23,
        27,
        1,
        6,
        27,
        31,
        1,
        31,
        10,
        35,
        1,
        35,
        6,
        39,
        1,
        39,
        13,
        43,
        2,
        10,
        43,
        47,
        1,
        47,
        6,
        51,
        2,
        6,
        51,
        55,
        1,
        5,
        55,
        59,
        2,
        13,
        59,
        63,
        2,
        63,
        9,
        67,
        1,
        5,
        67,
        71,
        2,
        13,
        71,
        75,
        1,
        75,
        5,
        79,
        1,
        10,
        79,
        83,
        2,
        6,
        83,
        87,
        2,
        13,
        87,
        91,
        1,
        9,
        91,
        95,
        1,
        9,
        95,
        99,
        2,
        99,
        9,
        103,
        1,
        5,
        103,
        107,
        2,
        9,
        107,
        111,
        1,
        5,
        111,
        115,
        1,
        115,
        2,
        119,
        1,
        9,
        119,
        0,
        99,
        2,
        0,
        14,
        0
    ]);
})();