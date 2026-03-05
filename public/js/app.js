document.addEventListener('DOMContentLoaded', async () => {
    const substanceSelect = document.getElementById('substance');
    const form = document.getElementById('simulationForm');
    const ctx = document.getElementById('resultsChart').getContext('2d');
    const submitBtn = document.getElementById('simulateBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    
    let chartInstance = null;

    // 1. Load Substances
    try {
        const res = await fetch('/api/substances');
        if (!res.ok) throw new Error('Failed to fetch substances');
        
        const substances = await res.json();
        
        substances.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub._id;
            option.textContent = sub.name;
            substanceSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Error loading substances:', err);
        alert('Could not load substance list. Please check your connection and refresh.');
    }

    // 2. Handle Simulation
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state
        setLoading(true);

        const payload = {
            substanceId: substanceSelect.value,
            dose: parseFloat(document.getElementById('dose').value),
            weight: parseFloat(document.getElementById('weight').value),
            age: parseFloat(document.getElementById('age').value),
            doseCount: parseInt(document.getElementById('doses').value) || 1,
            doseInterval: parseFloat(document.getElementById('interval').value) || 0
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
                // renderStats(data.simulation.stats); // Stats feature is currently placeholder
            } else {
                alert('Simulation failed: ' + (data.message || 'Unknown error'));
            }
        } catch (err) {
            console.error('Simulation error:', err);
            alert('An error occurred during simulation. Please try again.');
        } finally {
            // Reset button state
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.textContent = 'Simulating...';
            btnSpinner.classList.remove('d-none');
        } else {
            submitBtn.disabled = false;
            btnText.textContent = 'Run Simulation 🚀';
            btnSpinner.classList.add('d-none');
        }
    }

    function renderChart(timeline) {
        // Extract data arrays
        const labels = timeline.map(t => t.time.toFixed(1)); // Format time to 1 decimal
        const concentration = timeline.map(t => t.concentration);
        const effect = timeline.map(t => t.effect);
        const tolerance = timeline.map(t => t.tolerance * 100); // Convert to percentage

        // Destroy existing chart to prevent overlap
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Blood Concentration (mg/L)',
                        data: concentration,
                        borderColor: 'rgba(220, 53, 69, 1)', // Red
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        yAxisID: 'y',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Perceived Effect (0-100)',
                        data: effect,
                        borderColor: 'rgba(13, 110, 253, 1)', // Blue
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        yAxisID: 'y1',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Tolerance Level (%)',
                        data: tolerance,
                        borderColor: 'rgba(25, 135, 84, 1)', // Green
                        borderDash: [5, 5],
                        yAxisID: 'y1',
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Pharmacokinetic & Pharmacodynamic Timeline'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toFixed(2);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Time (Hours)' }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Concentration (mg/L)' },
                        beginAtZero: true
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