const mongoose = require('mongoose');

const SimulationSchema = new mongoose.Schema({
  userProfile: {
    weight: Number,
    age: Number,
    gender: String,
    metabolismRate: { type: Number, default: 1.0 } // Genetik faktör
  },
  substance: {
    name: String,
    dose: Number, // mg
    frequency: Number // hours between doses (if multi-dose)
  },
  results: {
    peakConcentration: Number,
    peakTime: Number,
    totalExposure: Number, // AUC (Area Under Curve)
    maxRiskScore: Number,
    riskBand: String, // 'Low', 'Medium', 'High', 'Critical'
    timeline: [
      {
        time: Number, // hour
        concentration: Number, // mg/L
        effect: Number, // 0-100 (Hill equation result)
        tolerance: Number, // 0-1
        neurotransmitters: {
          dopamine: Number,
          serotonin: Number,
          gaba: Number
        },
        risk: Number // Instant risk score
      }
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Simulation', SimulationSchema);
