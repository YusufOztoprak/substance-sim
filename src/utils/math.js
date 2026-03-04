/**
 * Mathematical Utility Functions for Pharmacokinetics
 */

/**
 * Bateman Function: Calculates concentration at time t for a one-compartment model with first-order absorption.
 * C(t) = (D * ka / (Vd * (ka - ke))) * (e^(-ke * t) - e^(-ka * t))
 */
const Bateman = (dose, ka, ke, Vd, t) => {
    if (t < 0) return 0;
    if (ka === ke) {
        // Special case where absorption rate equals elimination rate
        return (dose / Vd) * ke * t * Math.exp(-ke * t);
    }
    const preFactor = (dose * ka) / (Vd * (ka - ke));
    return preFactor * (Math.exp(-ke * t) - Math.exp(-ka * t));
};

/**
 * Hill Equation: Models the relationship between drug concentration and effect.
 * E = (Emax * C^n) / (EC50^n + C^n)
 * Assuming n (Hill coefficient) = 1 for simplicity unless specified.
 */
const Hill = (concentration, ec50, emax, n = 1) => {
    if (concentration <= 0) return 0;
    const num = emax * Math.pow(concentration, n);
    const den = Math.pow(ec50, n) + Math.pow(concentration, n);
    return num / den;
};

module.exports = { Bateman, Hill };
