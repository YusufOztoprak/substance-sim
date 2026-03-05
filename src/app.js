const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const simulationRoutes = require('./routes/simulationRoutes');

// Connect to Database
connectDB();

const app = express();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api', simulationRoutes);

// Serve static assets in production
// Set static folder
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
