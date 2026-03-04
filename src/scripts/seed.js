require('dotenv').config();
const mongoose = require('mongoose');
const Substance = require('../models/Substance');
const connectDB = require('../config/db');

const substances = [
  {
    name: "Caffeine",
    type: "stimulant",
    halfLife: 5, // 5 hours
    bioavailability: 0.99,
    absorptionRate: 1.5, // Fast absorption
    distributionVolume: 0.6, // L/kg
    ec50: 10, // mg/L
    emax: 80,
    neurotransmitters: {
      dopamine: 20,
      norepinephrine: 40,
      serotonin: 5,
      gaba: 0,
      glutamate: 10
    },
    toxicityThreshold: 50, // mg/L
    lethalDose: 150, // mg/kg
    description: "A central nervous system stimulant of the methylxanthine class."
  },
  {
    name: "Alcohol (Ethanol)",
    type: "depressant",
    halfLife: 1, // Approx zero-order but modeled as 1h for simplicity
    bioavailability: 0.8,
    absorptionRate: 2.0, // Very fast
    distributionVolume: 0.6, // L/kg (varies by gender)
    ec50: 500, // mg/L (0.05% BAC approx)
    emax: 100,
    neurotransmitters: {
      dopamine: 30,
      norepinephrine: 0,
      serotonin: 10,
      gaba: 60, // Major effect
      glutamate: -40 // Inhibits
    },
    toxicityThreshold: 3000, // 0.30% BAC
    lethalDose: 5000, // 0.50% BAC approx
    description: "A psychoactive substance that is the active ingredient in drinks such as beer, wine, and distilled spirits."
  },
  {
    name: "Amphetamine (Adderall)",
    type: "stimulant",
    halfLife: 10, // 10-12 hours
    bioavailability: 0.75,
    absorptionRate: 1.0,
    distributionVolume: 3.5, // High Vd
    ec50: 0.05, // mg/L
    emax: 95,
    neurotransmitters: {
      dopamine: 80, // Strong release
      norepinephrine: 70,
      serotonin: 10,
      gaba: 0,
      glutamate: 20
    },
    toxicityThreshold: 0.5, // mg/L
    lethalDose: 20, // mg/kg
    description: "A central nervous system stimulant that is used in the treatment of attention deficit hyperactivity disorder (ADHD)."
  },
  {
    name: "Nicotine",
    type: "stimulant",
    halfLife: 2, // 2 hours
    bioavailability: 0.3, // Oral is low, but smoking is high. Assuming oral/gum for sim.
    absorptionRate: 3.0, // Very fast if smoked/vaped
    distributionVolume: 2.6,
    ec50: 0.02,
    emax: 60,
    neurotransmitters: {
      dopamine: 40,
      norepinephrine: 30,
      serotonin: 10,
      gaba: 0,
      glutamate: 10
    },
    toxicityThreshold: 0.1,
    lethalDose: 6.5, // mg/kg
    description: "A stimulant and potent parasympathomimetic alkaloid that is naturally produced in the nightshade family of plants."
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log("Connected to DB...");
    
    await Substance.deleteMany({});
    console.log("Cleared existing substances...");
    
    await Substance.insertMany(substances);
    console.log("Database seeded successfully!");
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();