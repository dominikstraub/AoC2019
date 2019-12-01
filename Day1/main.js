(() => {
    let modules = [
        115175,
        57676,
        60193,
        72564,
        80321,
        71598,
        105010,
        117412,
        131402,
        123335,
        115916,
        149847,
        101974,
        106640,
        60426,
        79110,
        96761,
        113017,
        61374,
        115030,
        93834,
        70762,
        65579,
        141554,
        72032,
        79904,
        90575,
        103557,
        133428,
        59508,
        118219,
        138231,
        103913,
        103836,
        54845,
        110272,
        121529,
        71820,
        104270,
        78622,
        117267,
        74147,
        145980,
        118616,
        69569,
        140008,
        89901,
        97815,
        67603,
        133165,
        100395,
        96554,
        53074,
        88629,
        74968,
        129337,
        62372,
        77034,
        102219,
        53661,
        54411,
        95923,
        53990,
        105827,
        61721,
        84050,
        128613,
        125007,
        127985,
        56573,
        116470,
        77464,
        112006,
        142367,
        111543,
        71770,
        121529,
        147762,
        119612,
        126423,
        148684,
        78702,
        86829,
        65985,
        78223,
        81857,
        83423,
        147118,
        129117,
        147612,
        63482,
        57350,
        126132,
        88534,
        90676,
        56669,
        120383,
        126892,
        74203,
        103766
    ];

    // take its mass, divide by three, round down, and subtract 2.
    let calculateFuelRequirement = mass => {
        return Math.floor(mass / 3) - 2;
    };

    // fuel for mass & fuel
    let calculateFuelRequirementInclFuel = mass => {
        let fuel = calculateFuelRequirement(mass);
        if (fuel <= 0) {
            return 0;
        } else {
            return fuel + calculateFuelRequirementInclFuel(fuel);
        }
    };

    // tests
    console.log(
        'test:',
        // For a mass of 12, divide by 3 and round down to get 4, then subtract 2 to get 2.
        calculateFuelRequirement(12) === 2,
        // For a mass of 14, dividing by 3 and rounding down still yields 4, so the fuel required is also 2.
        calculateFuelRequirement(14) === 2,
        // For a mass of 1969, the fuel required is 654.
        calculateFuelRequirement(1969) === 654,
        // For a mass of 100756, the fuel required is 33583.
        calculateFuelRequirement(100756) === 33583
    );

    let fuel = modules.reduce((fuel, mass) => fuel + calculateFuelRequirement(mass), 0);
    console.log('result:', fuel);

    // test fuel for fuel
    // The fuel required by a module of mass 100756 and its fuel is: 33583 + 11192 + 3728 + 1240 + 411 + 135 + 43 + 12 + 2 = 50346.
    console.log('test:', calculateFuelRequirementInclFuel(100756) === 50346);

    let fuelExtended = modules.reduce((fuel, mass) => fuel + calculateFuelRequirementInclFuel(mass), 0);
    console.log('result:', fuelExtended);
})();
