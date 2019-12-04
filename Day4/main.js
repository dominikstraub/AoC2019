(() => {
    const min = 165432;
    const max = 707912;
    const length = 6;
    let count = 0;
    for (let code = min; code <= max; code++) {
        const codeString = '' + code;
        let onlyIncrease = true;
        let sameDigit = false;
        for (let digit = 0; digit < length - 1; digit++) {
            if (codeString[digit] > codeString[digit + 1]) {
                onlyIncrease = false;
                break;
            }
            if (
                codeString[digit] === codeString[digit + 1] &&
                codeString[digit + 1] !== codeString[digit + 2] &&
                codeString[digit - 1] !== codeString[digit]
            ) {
                sameDigit = true;
            }
        }
        if (onlyIncrease && sameDigit) {
            count++;
        }
    }
    console.log(count);
})();
