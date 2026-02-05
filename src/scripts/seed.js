const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Substance = require('../models/Substance');

dotenv.config();

const substances = [
    {
        name: 'Caffeine',
        type: 'Stimulant',
        halfLife: 5, // hours
        bioavailability: 0.99,
        distributionVolume: 0.7, // L/kg
        absorptionRate: 2.5, // ka
        ec50: 10, // mg/L
        emax: 100,
        toxicityThreshold: 50, // mg/L (Jitteriness, anxiety starts)
        lethalDose: 150, // mg/kg (Estimated LD50)
        description: 'Central nervous system stimulant. Blocks adenosine receptors.',
        neurotransmitters: { dopamine: 20, serotonin: 5, gaba: -10, norepinephrine: 15, glutamate: 10 }
    },
    {
        name: 'Alcohol',
        type: 'Depressant',
        halfLife: 1, 
        bioavailability: 0.8,
        distributionVolume: 0.6, // L/kg
        absorptionRate: 3.0, 
        ec50: 500, // mg/L
        emax: 100,
        toxicityThreshold: 2000, // mg/L (2.0 promil - severe intoxication)
        lethalDose: 5000, // mg/kg (approx LD50)
        description: 'Depressant. Enhances GABA effects, impairs coordination.',
        neurotransmitters: { dopamine: 40, serotonin: 10, gaba: 80, norepinephrine: -20, glutamate: -30 }
    },
    {
        name: 'Nicotine',
        type: 'Stimulant',
        halfLife: 2,
        bioavailability: 0.3, 
        distributionVolume: 2.6, // L/kg
        absorptionRate: 5.0, 
        ec50: 0.05, 
        emax: 100,
        toxicityThreshold: 0.1, // mg/L (Nausea starts)
        lethalDose: 6.5, // mg/kg (High toxicity)
        description: 'Stimulant. Agonist at nicotinic acetylcholine receptors.',
        neurotransmitters: { dopamine: 50, serotonin: 15, gaba: 0, norepinephrine: 30, glutamate: 10 }
    },
    {
        name: 'Paracetamol',
        type: 'Analgesic',
        halfLife: 2.5,
        bioavailability: 0.85,
        distributionVolume: 0.9, // L/kg
        absorptionRate: 1.5, 
        ec50: 15, 
        emax: 80, 
        toxicityThreshold: 150, // mg/L (Liver toxicity risk starts)
        lethalDose: 200, // mg/kg (Severe hepatotoxicity)
        description: 'Pain reliever. High doses cause liver toxicity (Hepatotoxicity).',
        neurotransmitters: { dopamine: 0, serotonin: 5, gaba: 0, norepinephrine: 0, glutamate: 0 }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/substance_sim');
        console.log('Connected to MongoDB...');

        await Substance.deleteMany({});
        console.log('Cleared existing substances...');

        await Substance.insertMany(substances);
        console.log('Substances seeded successfully!');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
