const { Bateman, Hill, Tolerance, Risk } = require('../utils/math'); // Assuming math utils might be separated later, but keeping logic here for now

/**
 * Calculates the metabolic slowdown factor based on age.
 * Metabolism slows down by ~0.8% per year after age 30.
 */
function calculateMetabolismFactor(age) {
    if (age <= 30) return 1.0;
    // Example: Age 70 -> (70-30) * 0.008 = 0.32 reduction -> Factor 0.68
    const reduction = (age - 30) * 0.008;
    return Math.max(0.5, 1.0 - reduction); // Don't let it drop below 50%
}

/**
 * Calculates the Volume of Distribution (Vd) based on weight.
 * Vd_total = Vd_per_kg * Weight
 */
function calculateAbsoluteVd(vdPerKg, weight) {
    // Safety check: if weight is missing or unrealistic, default to 70kg
    const safeWeight = weight > 0 ? weight : 70;
    return vdPerKg * safeWeight;
}

/**
 * Advanced Pharmacokinetic Simulation Engine
 * Uses Bateman Function for concentration and Hill Equation for effect.
 */
function calculateTimeline(params) {
    const {
        substance, // Object containing Vd (L/kg), ka, ke, EC50, Emax
        dose,      // Total dose in mg
        doses,     // Array of doses for multi-dose [{amount, time}]
        duration,  // Simulation duration in hours
        weight,    // User weight in kg
        age        // User age in years
    } = params;

    const timeStep = 0.1; // 6-minute intervals for precision
    const timeline = [];
    
    // 1. Adjust Parameters based on Biology
    const metabolismFactor = calculateMetabolismFactor(age);
    
    // Elimination rate (ke) slows down with age
    const adjustedKe = substance.ke * metabolismFactor;
    
    // Volume of Distribution (Vd) scales with weight
    // This is CRITICAL: Lower weight = Higher Concentration
    const absoluteVd = calculateAbsoluteVd(substance.Vd, weight);

    let cumulativeExposure = 0; // Area Under Curve (AUC)
    let maxConcentration = 0;

    // 2. Simulation Loop
    for (let t = 0; t <= duration; t += timeStep) {
        let currentConcentration = 0;

        // Superposition Principle: Sum the concentration of all doses
        // If simple single dose, treat as one dose at t=0
        const doseList = doses && doses.length > 0 ? doses : [{ amount: dose, time: 0 }];

        for (let d of doseList) {
            if (t >= d.time) {
                // Bateman Function: C(t) = (Dose * ka / (Vd * (ka - ke))) * (e^-ke*t - e^-ka*t)
                const timeSinceDose = t - d.time;
                
                // Avoid division by zero if ka == ke (rare but possible mathematically)
                let term;
                if (Math.abs(substance.ka - adjustedKe) < 0.001) {
                    term = (d.amount / absoluteVd) * adjustedKe * timeSinceDose * Math.exp(-adjustedKe * timeSinceDose);
                } else {
                    const preFactor = (d.amount * substance.ka) / (absoluteVd * (substance.ka - adjustedKe));
                    term = preFactor * (Math.exp(-adjustedKe * timeSinceDose) - Math.exp(-substance.ka * timeSinceDose));
                }
                
                currentConcentration += Math.max(0, term);
            }
        }

        if (currentConcentration > maxConcentration) maxConcentration = currentConcentration;

        // 3. Calculate Pharmacodynamics (Effect)
        // Hill Equation: E = (Emax * C^n) / (EC50^n + C^n) (Assuming n=1 for simplicity)
        const rawEffect = (substance.Emax * currentConcentration) / (substance.ec50 + currentConcentration);

        // 4. Calculate Tolerance
        // Tolerance builds up based on Cumulative Exposure (AUC)
        cumulativeExposure += currentConcentration * timeStep;
        const toleranceFactor = 1 - Math.exp(-0.05 * cumulativeExposure); // 0 to 1 (1 = full tolerance)
        
        // Net Effect is reduced by tolerance
        const netEffect = rawEffect * (1 - (toleranceFactor * 0.8)); // Max 80% tolerance

        timeline.push({
            time: Number(t.toFixed(1)),
            concentration: Number(currentConcentration.toFixed(4)),
            effect: Number(netEffect.toFixed(2)),
            tolerance: Number((toleranceFactor * 100).toFixed(1))
        });
    }

    // 5. Risk Calculation
    // Risk depends on: Peak Concentration (Acute Toxicity) + Total Exposure (Chronic Strain)
    // Age increases sensitivity to toxicity
    const ageRiskMultiplier = 1 + ((age > 30 ? age - 30 : 0) * 0.01); // 1% extra risk per year over 30
    
    // Normalize risk factors (Synthetic calibration)
    const acuteRisk = (maxConcentration / substance.ec50) * 20; 
    const chronicRisk = (cumulativeExposure / 10) * 5;
    
    let totalRiskScore = (acuteRisk + chronicRisk) * ageRiskMultiplier;
    
    // Cap risk at 100 for UI consistency, but allow overflow for "High" logic
    totalRiskScore = Math.min(100, Math.max(0, totalRiskScore));

    return {
        timeline,
        stats: {
            maxConcentration: maxConcentration.toFixed(3),
            totalExposure: cumulativeExposure.toFixed(2),
            riskScore: totalRiskScore.toFixed(1),
            metabolismEfficiency: (metabolismFactor * 100).toFixed(0) + "%"
        }
    };
}

module.exports = { calculateTimeline };