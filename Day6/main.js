(async () => {
    const startTime = performance.now();

    const response = await fetch('./input.json');
    // const response = await fetch('./test.json');
    // const response = await fetch('./test2.json');
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

    const buildPath = path => {
        const orbiter = path[0];
        for (const orbiteeKey of Object.keys(uom)) {
            if (uom[orbiteeKey].includes(orbiter)) {
                path.unshift(orbiteeKey);
                break;
            }
        }
        if (path[0] !== 'COM') {
            buildPath(path);
        }
        return path;
    };

    const findIntersection = (path1, path2) => {
        if (path2.length > path1.length) {
            [path1, path2] = [path2, path1];
        }
        return path1.filter(el => path2.includes(el)).pop();
    };

    const countTransfers = () => {
        const youPath = buildPath(['YOU']);
        const sanPath = buildPath(['SAN']);

        // console.log(youPath);
        // console.log(sanPath);

        const intersection = findIntersection(youPath, sanPath);
        // console.log(intersection);

        return youPath.length - 2 - youPath.indexOf(intersection) + sanPath.length - 2 - sanPath.indexOf(intersection);
    };

    const transfers = countTransfers();
    console.log(transfers);

    console.log('execution time', performance.now() - startTime);
})();
