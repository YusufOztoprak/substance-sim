document.addEventListener('DOMContentLoaded', async () => {
    const substanceSelect = document.getElementById('substance');
    const form = document.getElementById('simulationForm');
    const ctx = document.getElementById('resultsChart').getContext('2d');
    let chart;

    // 1. Load Substances
    try {
        const res = await fetch('/api/substances');
        const substances = await res.json();
        
        substances.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub._id;
            option.textContent = sub.name;
            substanceSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Error loading substances:', err);
    }

    // 2. Handle Simulation
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            substanceId: substanceSelect.value,
            dose: parseFloat(document.getElementById('dose').value),
            weight: parseFloat(document.getElementById('weight').value),
            age: parseFloat(document.getElementById('age').value),
            doses: parseInt(document.getElementById('doses').value),
            interval: parseFloat(document.getElementById('interval').value)
        };

        try {
            const res = await fetch('/api/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            
            if (data.success) {
                renderChart(data.simulation.timeline);
                renderStats(data.simulation.stats);
            }
        } catch (err) {
            console.error('Simulation error:', err);
        }
    });

    function renderStats(stats) {
        const statsDiv = document.getElementById('stats');
        statsDiv.innerHTML = `
            <div class="row text-center">
                <div class="col-md-3">
                    <div class="card bg-light mb-3">
                        <div class="card-body">
                            <h5 class="card-title text-danger">${stats.riskScore}</h5>
                            <p class="card-text">Risk Score (0-100)</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-light mb-3">
                        <div class="card-body">
                            <h5 class="card-title text-primary">${stats.maxConcentration} mg/L</h5>
                            <p class="card-text">Peak Concentration</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-light mb-3">
                        <div class="card-body">
                            <h5 class="card-title text-success">${stats.metabolismEfficiency}</h5>
                            <p class="card-text">Metabolism Efficiency</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-light mb-3">
                        <div class="card-body">
                            <h5 class="card-title text-warning">${stats.totalExposure}</h5>
                            <p class="card-text">Total Exposure (AUC)</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderChart(timeline) {
        const labels = timeline.map(t => t.time);
        const concentration = timeline.map(t => t.concentration);
        const effect = timeline.map(t => t.effect);
        const tolerance = timeline.map(t => t.tolerance);

        // Destroy existing chart to prevent overlap
        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Blood Concentration (mg/L)',
                        data: concentration,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        yAxisID: 'y',
                        fill: true
                    },
                    {
                        label: 'Perceived Effect (0-100)',
                        data: effect,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        yAxisID: 'y1',
                        fill: true
                    },
                    {
                        label: 'Tolerance Build-up (%)',
                        data: tolerance,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderDash: [5, 5],
                        yAxisID: 'y1',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Concentration (mg/L)' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: 'Effect / Tolerance (%)' },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
    }
});