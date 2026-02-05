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
    type: Number, // 0-1 (F) - Kana karışma oranı
    default: 1.0
  },
  absorptionRate: {
    type: Number, // (ka) - Emilim hızı sabiti
    default: 1.5
  },
  distributionVolume: {
    type: Number, // (Vd) - L/kg
    default: 0.8
  },
  
  // Pharmacodynamics (PD) Parameters (Hill Equation)
  ec50: {
    type: Number, // mg/L - Yarı maksimum etki konsantrasyonu
    default: 0.5
  },
  emax: {
    type: Number, // 0-100 - Maksimum etki skoru
    default: 100
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
    type: Number, // mg/L - Zehirlenme başlangıcı
    required: true
  },
  lethalDose: {
    type: Number, // mg/kg (LD50 estimate)
    required: true
  },
  toleranceFactor: {
    type: Number, // 0-1 - Vücudun alışma hızı
    default: 0.1
  },
  withdrawalFactor: {
    type: Number, // 0-1 - Yoksunluk şiddeti
    default: 0.2
  },

  description: String
});

module.exports = mongoose.model('Substance', SubstanceSchema);
