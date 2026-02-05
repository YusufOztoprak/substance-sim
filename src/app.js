const express = require("express");
const app = express();
const sequelize = require("./config/db");
const Substance = require("./models/Substance");
const Simulation = require("./models/Simulation");

sequelize.sync().then(() => {
    console.log("Database synced");
});


app.use(express.json());

const simulationRoutes = require("./routes/simulationRoutes");
app.use("/api", simulationRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Simulation API running on port", PORT);
});
