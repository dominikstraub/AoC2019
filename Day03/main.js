(() => {
    const startTime = performance.now();

    let closest = null;
    let shortest = null;

    const putWire = (grid, wireId, x, y, distance) => {
        if (!grid[x]) {
            grid[x] = [];
        }
        if (!grid[x][y]) {
            grid[x][y] = [];
        }
        grid[x][y][wireId] = grid[x][y][wireId] || distance;
        if (checkCorner(grid, x, y) === true) {
            const corner = grid[x][y];
            const currentClosest = Math.abs(x) + Math.abs(y);
            let currentShortest = 0;
            for (const wire of corner) {
                currentShortest += wire;
            }
            if (!closest || currentClosest < closest) {
                closest = currentClosest;
            }
            if (!shortest || currentShortest < shortest) {
                shortest = currentShortest;
            }
        }
    };

    const connectWirePart = (grid, wire, wireId, move, fullDistance) => {
        const direction = move.substring(0, 1);
        let distance = parseInt(move.substring(1), 10);

        for (; distance > 0; distance--) {
            ++fullDistance;
            switch (direction) {
                case 'U':
                    ++wire[1];
                    break;
                case 'R':
                    ++wire[0];
                    break;
                case 'D':
                    --wire[1];
                    break;
                case 'L':
                    --wire[0];
                    break;
            }
            putWire(grid, wireId, wire[0], wire[1], fullDistance);
        }
        return fullDistance;
    };

    const connectWire = (grid, wire, wireId, path) => {
        const wireParts = path.split(',');
        let fullDistance = 0;
        for (const wirePart of wireParts) {
            fullDistance = connectWirePart(grid, wire, wireId, wirePart, fullDistance);
        }
    };

    const connectAllWires = (grid, wirePaths) => {
        const wires = [
            [0, 0],
            [0, 0]
        ];
        for (let i = 0; i < wirePaths.length; i++) {
            connectWire(grid, wires[i], i, wirePaths[i]);
        }
    };

    const checkCorner = (grid, x, y) => {
        const column = grid[x];
        if (!column) {
            return false;
        }
        const corner = column[y];
        if (!corner) {
            return false;
        }
        let wireCount = 0;
        for (const wire of corner) {
            if (typeof wire === 'number') {
                wireCount++;
            }
        }
        return wireCount >= 2;
    };

    const run = wirePaths => {
        const grid = [];
        closest = null;
        shortest = null;
        connectAllWires(grid, wirePaths);
        // console.log(grid);
        console.log('closest', closest);
        console.log('shortest', shortest);
    };

    // run(['R8,U5,L5,D3', 'U7,R6,D4,L4']); // 6 // 30
    // run(['R75,D30,R83,U83,L12,D49,R71,U7,L72', 'U62,R66,U55,R34,D71,R55,D58,R83']); // 159 // 610
    // run(['R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51', 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7']); // 135 // 410

    run([
        'R1005,D32,R656,U228,L629,U59,L558,D366,L659,D504,R683,U230,R689,U489,R237,U986,L803,U288,R192,D473,L490,U934,L749,D631,L333,U848,L383,D363,L641,D499,R926,D945,L520,U311,R75,D414,L97,D338,L754,U171,R601,D215,R490,U164,R158,U499,L801,U27,L671,D552,R406,U168,R12,D321,L97,U27,R833,U503,R950,U432,L688,U977,R331,D736,R231,U301,L579,U17,R984,U399,L224,U100,L266,U184,R46,D989,L851,D739,R45,D231,R893,D372,L260,U26,L697,U423,L716,D573,L269,U867,R722,U193,R889,D322,L743,U371,L986,D835,R534,U170,R946,U271,L514,D521,L781,U390,L750,D134,L767,U599,L508,U683,L426,U433,L405,U10,L359,D527,R369,D365,L405,D812,L979,D122,L782,D460,R583,U765,R502,D2,L109,D69,L560,U76,R130,D794,R197,D113,L602,D123,L190,U246,L407,D957,L35,U41,L884,D591,R38,D911,L269,D204,R332,U632,L826,D202,L984,U153,L187,U472,R272,U232,L786,U932,L618,U104,R632,D469,L868,D451,R261,U647,L211,D781,R609,D549,L628,U963,L917,D716,L218,U71,L148,U638,R34,U133,R617,U312,L215,D41,L673,U643,R379,U486,L273,D539,L294,D598,L838,D60,L158,U817,R207,U825,L601,D786,R225,D89,L417,U481,L416,U133,R261,U405,R109,U962,R104,D676,R966,U138,L343,U14,L82,U564,R73,D361,R678,D868,L273,D879,R629,U164,R228,U949,R504,D254,L662,D726,R126,D437,R569,D23,R246,U840,R457,D429,R296,U110,L984,D106,L44,U264,R801,D350,R932,D334,L252,U714,L514,U261,R632,D926,R944,U924,R199,D181,L737,U408,R636,U57,L380,D949,R557,U28,L432,D83,R829,D865,L902,D351,R71,U704,R477,D501,L882,D75,R325,D53,L990,U460,R165,D82,R577,D788,R375,U264,L178,D193,R830,D343,L394',
        'L1003,U125,L229,U421,R863,D640,L239,U580,R342,U341,R989,U732,R51,U140,L179,U60,R483,D575,R49,U220,L284,U336,L905,U540,L392,U581,L570,U446,L817,U694,R923,U779,R624,D387,R495,D124,R862,D173,R425,D301,L550,D605,R963,U503,R571,U953,L878,D198,L256,D77,R409,D752,R921,D196,R977,U86,L842,U155,R987,D39,L224,U433,L829,D99,R558,U736,R645,D335,L52,D998,L613,D239,R470,U79,R839,D71,L753,U127,R135,D429,R729,U71,L151,U875,R668,D220,L501,D822,R306,D557,R461,U942,R59,U14,R353,D546,R409,D261,R204,U873,L847,U936,R611,U487,R474,U406,R818,U838,L301,D684,R861,D738,L265,D214,R272,D702,L145,U872,R345,D623,R200,D186,R407,U988,L608,U533,L185,D287,L549,U498,L630,U295,L425,U517,L263,D27,R697,U177,L615,U960,L553,U974,L856,U716,R126,D819,L329,D233,L212,U232,L164,D712,R316,D682,L641,U676,L535,U783,R39,U953,R39,U511,R837,U325,R391,U401,L642,U435,R626,U801,R876,D849,R448,D8,R74,U238,L186,D558,L648,D258,R262,U7,L510,U178,L183,U415,L631,D162,L521,D910,R462,U789,R885,D822,R908,D879,R614,D119,L570,U831,R993,U603,L118,U764,L414,U39,R14,U189,L415,D744,R897,U714,R326,U348,R822,U98,L357,D478,L464,D851,L545,D241,L672,U197,R156,D916,L246,U578,R4,U195,R82,D402,R327,D429,R119,U661,L184,D122,R891,D499,L808,U519,L36,U323,L259,U479,L647,D354,R891,D320,R653,U772,L158,U608,R149,U564,L164,D998,L485,U107,L145,U834,R846,D462,L391,D661,R841,U742,L597,D937,L92,U877,L350,D130,R684,U914,R400,D910,L739,U789,L188,U256,R10,U258,L965,U942,R234,D106,R852,U108,R732,U339,L955,U271,L340,U23,R373,D100,R137,U648,L130'
    ]);

    console.log('execution time', performance.now() - startTime);
})();
