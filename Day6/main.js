(async () => {
    const startTime = performance.now();

    const response = await fetch('./input.json');
    // const response = await fetch('./test.json');
    const input = (await response.json()).data;
    // console.log(input);

    const uom = {};

    for (const orbit of input) {
        const pair = orbit.split(')');
        if (!uom[pair[0]]) {
            uom[pair[0]] = [];
        }
        uom[pair[0]].push(pair[1]);
    }

    // console.log(uom);
    // console.log(uom['COM']);

    const countOrbits = (orbitee, orbiteeOrbits) => {
        let orbits = 0;
        let childOrbits = orbiteeOrbits + 1;
        for (const orbiterKey of orbitee) {
            orbits += childOrbits;
            const orbiter = uom[orbiterKey];
            if (orbiter) {
                orbits += countOrbits(orbiter, childOrbits);
            }
        }
        return orbits;
    };

    const orbits = countOrbits(uom['COM'], 0);
    console.log(orbits);

    console.log('execution time', performance.now() - startTime);
})();
