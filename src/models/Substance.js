const mongoose = require('mongoose');

const SubstanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String, // 'stimulant', 'depressant', 'hallucinogen'
    required: true
  },
  // Pharmacokinetics (PK) Parameters
  halfLife: {
    type: Number, // hours (t1/2)
    required: true
  },
  bioavailability: {
    type: Number, // 0-1 (F) - Fraction of dose that reaches systemic circulation
    default: 1.0
  },
  absorptionRate: {
    type: Number, // (ka) - Absorption rate constant
    default: 1.5
  },
  distributionVolume: {
    type: Number, // (Vd) - L/kg
    default: 0.8
  },
  
  // Pharmacodynamics (PD) Parameters (Hill Equation)
  ec50: {
    type: Number, // mg/L - Concentration for half-maximal effect
    default: 0.5
  },
  emax: {
    type: Number, // 0-100 - Maximum effect score
    // default: 100
  },

  // Neurochemical Profile (Effect Vector)
  neurotransmitters: {
    dopamine: { type: Number, default: 0 }, // + or - effect
    serotonin: { type: Number, default: 0 },
    norepinephrine: { type: Number, default: 0 },
    gaba: { type: Number, default: 0 },
    glutamate: { type: Number, default: 0 }
  },

  // Risk & Toxicity
  toxicityThreshold: {
    type: Number, // mg/L - Onset of toxicity
    required: true
  },
  lethalDose: {
    type: Number, // mg/kg (LD50 estimate)
    required: true
  },
  toleranceFactor: {
    type: Number, // 0-1 - Rate of tolerance buildup
    default: 0.1
  },
  withdrawalFactor: {
    type: Number, // 0-1 - Severity of withdrawal
    default: 0.2
  },

  description: String
});

module.exports = mongoose.model('Substance', SubstanceSchema);
