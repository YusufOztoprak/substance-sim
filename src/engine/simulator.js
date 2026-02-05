function concentrationSingleDose(dose, Vd, k, t) {
    return (dose / Vd) * Math.exp(-k * t);
}

function totalConcentration(doses, Vd, k, t) {
    let C = 0;

    for (const d of doses) {
        if (t >= d.time) {
            C += concentrationSingleDose(d.amount, Vd, k, t - d.time);
        }
    }

    return C;
}
