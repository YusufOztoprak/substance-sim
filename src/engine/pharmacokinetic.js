/**
 * Birinci Derece Kinetik Hesaplamaları
 */

// Konsantrasyon Hesaplama: C(t) = (Doz / Vd) * e^(-k * t)
// Vd: Dağılım Hacmi (L), k: Eliminasyon sabiti (1/saat)
function calculateConcentration(dose, Vd, k, time) {
    const initialConcentration = dose / Vd;
    return initialConcentration * Math.exp(-k * time);
}

// Etki Hesaplama (Hill Denklemi / Sigmoid Model)
// E = (Emax * C) / (EC50 + C)
// Emax: Maksimum etki, EC50: Yarı maksimum etkiyi sağlayan konsantrasyon
function calculateEffect(concentration, Emax, EC50) {
    if (concentration <= 0) return 0;
    return (Emax * concentration) / (EC50 + concentration);
}

// Simülasyon Döngüsü
function runSimulation(substance, dose, durationHours, timeStep = 0.5) {
    const timeSeries = [];
    let currentTime = 0;

    while (currentTime <= durationHours) {
        // 1. Kandaki Konsantrasyonu Hesapla
        const concentration = calculateConcentration(
            dose,
            substance.Vd,
            substance.k,
            currentTime
        );

        // 2. Beyindeki/Vücuttaki Etkiyi Hesapla (0-100 arası veya birimsel)
        const effect = calculateEffect(
            concentration,
            substance.Emax,
            substance.EC50
        );

        timeSeries.push({
            time: currentTime,
            concentration: parseFloat(concentration.toFixed(4)),
            effect: parseFloat(effect.toFixed(4))
        });

        currentTime += timeStep;
    }

    return timeSeries;
}

module.exports = { runSimulation };
