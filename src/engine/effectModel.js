function tolerance(exposure, alpha = 0.02) {
    return 1 - Math.exp(-alpha * exposure);
}

function adjustedEffect(effect, toleranceValue) {
    return effect * (1 - toleranceValue);
}
