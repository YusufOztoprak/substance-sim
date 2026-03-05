const Substance = require('../models/Substance');
const Simulation = require('../models/Simulation');
const { calculateTimeline } = require('../engine/pharmacokinetics');

exports.runSimulation = async (req, res) => {
    try {
        console.log('Simulation Request Body:', req.body);

        const { 
            substanceId, 
            weight, 
            age, 
            dose, 
            doses = 1, 
            interval = 0 
        } = req.body;

        // 1. Input Validation
        if (!substanceId) {
            return res.status(400).json({ error: 'Substance ID is required' });
        }
        if (!weight || isNaN(weight) || weight <= 0) {
            return res.status(400).json({ error: 'Valid weight is required' });
        }
        if (!dose || isNaN(dose) || dose <= 0) {
            return res.status(400).json({ error: 'Valid dose is required' });
        }

        // 2. Fetch Substance
        const substance = await Substance.findById(substanceId);
        if (!substance) {
            return res.status(404).json({ error: 'Substance not found' });
        }
        console.log('Substance Found:', substance.name);

        // 3. Safety Check for Half-Life
        if (!substance.halfLife || substance.halfLife <= 0) {
            console.error(`Invalid half-life for substance ${substance.name}: ${substance.halfLife}`);
            return res.status(500).json({ error: 'Invalid substance data: Half-life must be greater than 0' });
        }

        // 4. Prepare Engine Parameters
        const ke = 0.693 / substance.halfLife;
        
        // Ensure all parameters have valid defaults to prevent NaN
        const engineParams = {
            substance: {
                Vd: substance.distributionVolume || 0.8, 
                ka: substance.absorptionRate || 1.5,     
                ke: ke,
                ec50: substance.ec50 || 0.5,
                Emax: substance.emax || 100
            },
            dose: Number(dose),
            doses: Number(doses),
            interval: Number(interval),
            duration: 24, // Simulate for 24 hours
            weight: Number(weight),
            age: Number(age) || 25
        };

        console.log('Engine Params:', JSON.stringify(engineParams, null, 2));

        // 5. Run Simulation Engine
        const simulationResults = calculateTimeline(engineParams);

        // 6. Validate Results
        if (!simulationResults || !simulationResults.stats) {
            throw new Error('Simulation engine returned invalid results');
        }

        const maxConc = parseFloat(simulationResults.stats.maxConcentration);
        if (isNaN(maxConc)) {
            console.error('Simulation resulted in NaN:', simulationResults);
            return res.status(500).json({ error: 'Simulation calculation failed (NaN result)' });
        }

        // 7. Save to Database
        const newSimulation = new Simulation({
            userProfile: { weight: Number(weight), age: Number(age) },
            substance: {
                name: substance.name,
                dose: Number(dose),
                frequency: Number(interval)
            },
            results: {
                peakConcentration: maxConc,
                totalExposure: parseFloat(simulationResults.stats.totalExposure) || 0,
                maxRiskScore: parseFloat(simulationResults.stats.riskScore) || 0,
                riskBand: (simulationResults.stats.riskScore > 50) ? 'High' : 'Low',
                timeline: simulationResults.timeline
            }
        });

        await newSimulation.save();
        console.log('Simulation saved successfully');

        res.json(simulationResults);

    } catch (error) {
        console.error('Simulation Error:', error);
        res.status(500).json({ error: 'An error occurred during simulation', details: error.message });
    }
};
