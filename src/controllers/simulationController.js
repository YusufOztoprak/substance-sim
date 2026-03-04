const Substance = require('../models/Substance');
const Simulation = require('../models/Simulation');
const { calculateTimeline } = require('../engine/pharmacokinetics');

exports.runSimulation = async (req, res) => {
    try {
        // 1. Extract Inputs (Matching Frontend Payload)
        const { 
            substanceId, 
            weight, 
            age, 
            dose, 
            doses = 1,      // Frontend sends 'doses' (count)
            interval = 0,   // Frontend sends 'interval' (hours)
            duration = 24 
        } = req.body;

        // 2. Fetch Substance Data
        const substance = await Substance.findById(substanceId);
        if (!substance) {
            return res.status(404).json({ error: 'Substance not found' });
        }

        // 3. Prepare Scientific Parameters
        // Calculate Elimination Rate Constant (ke) from Half-Life
        // ke = ln(2) / t1/2
        const ke = 0.693 / substance.halfLife;

        // Generate Dose Schedule (Superposition Principle)
        const doseArray = [];
        for (let i = 0; i < Number(doses); i++) {
            doseArray.push({
                amount: Number(dose),
                time: i * Number(interval)
            });
        }

        // Map Database Fields to Engine Parameters
        // CRITICAL FIX: Provide default values for optional fields to prevent NaN errors
        const engineParams = {
            substance: {
                Vd: substance.distributionVolume || 0.8, // Default to 0.8 L/kg if missing
                ka: substance.absorptionRate || 1.5,     // Default to 1.5 /h if missing
                ke: ke,
                ec50: substance.ec50 || 0.5,
                Emax: substance.emax || 100
            },
            dose: Number(dose), // Base dose for reference
            doses: doseArray,   // Full schedule
            duration: Number(duration),
            weight: Number(weight),
            age: Number(age)
        };

        // 4. Run Scientific Simulation Engine
        const simulationResults = calculateTimeline(engineParams);

        // 5. Save to Database (MongoDB)
        const newSimulation = new Simulation({
            userProfile: { weight, age },
            substance: {
                name: substance.name,
                dose: Number(dose),
                frequency: Number(interval)
            },
            results: {
                peakConcentration: parseFloat(simulationResults.stats.maxConcentration),
                totalExposure: parseFloat(simulationResults.stats.totalExposure),
                maxRiskScore: parseFloat(simulationResults.stats.riskScore),
                riskBand: simulationResults.stats.riskScore > 50 ? 'High' : 'Low', // Simple logic for now
                timeline: simulationResults.timeline
            }
        });

        await newSimulation.save();

        // 6. Return Results (Matching Frontend Expectation)
        res.json({
            success: true,
            simulationId: newSimulation._id,
            simulation: simulationResults // Frontend expects data.simulation.timeline
        });

    } catch (error) {
        console.error('Simulation Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getSubstances = async (req, res) => {
    try {
        const substances = await Substance.find({}, 'name type description');
        res.json(substances);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
