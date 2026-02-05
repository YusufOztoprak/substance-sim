# Substance Sim: Advanced Pharmacokinetic Simulation Engine 🧪

**Substance Sim** is a scientific research platform designed to model the pharmacokinetics (PK) and pharmacodynamics (PD) of psychoactive and medical substances. Unlike simple calculators, it uses differential equations to simulate absorption, distribution, metabolism, and excretion (ADME) processes.

## 🚀 Key Features

- **Advanced Math Engine:** Implements the **Bateman Function** for dual-phase (absorption & elimination) kinetics.
- **Pharmacodynamics:** Uses the **Hill Equation** to model the non-linear relationship between concentration and biological effect.
- **Neuroadaptation Model:** Simulates **tolerance** build-up over time based on cumulative exposure (AUC).
- **Multi-Dose Simulation:** Supports complex dosing schedules (e.g., "3 doses every 4 hours") to analyze accumulation and toxicity.
- **Medical & Psychoactive Models:** Includes models for Caffeine, Alcohol, Nicotine, and **Paracetamol** (Liver Toxicity).

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js (REST API)
- **Database:** MongoDB (Scientific Data Storage)
- **Frontend:** HTML5, Bootstrap 5, Chart.js (Dual-Axis Visualization)
- **Math:** Custom implementation of PK/PD differential equations

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YusufOztoprak/substance-sim.git
    cd substance-sim
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file (or use the provided `.env.example`):
    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/substance_sim
    ```

4.  **Seed the Database (Crucial Step):**
    Populate the database with scientific data (Caffeine, Alcohol, Nicotine, Paracetamol):
    ```bash
    npm run seed
    ```

5.  **Start the Simulation Engine:**
    ```bash
    npm start
    ```

6.  **Launch:**
    Open `http://localhost:3000` in your browser.

## 🔬 The Science Behind It

This engine goes beyond simple half-life calculations. It implements:

### 1. The Bateman Function (Concentration)
$$ C(t) = \frac{D \cdot k_a}{V_d (k_a - k_e)} \left( e^{-k_e t} - e^{-k_a t} \right) $$

*Simulates the rise (absorption) and fall (elimination) of substance levels.*

### 2. The Hill Equation (Effect)
$$ E = \frac{E_{max} \cdot C^n}{EC_{50}^n + C^n} $$

*Models the sigmoidal dose-response curve.*

### 3. Tolerance (Neuroadaptation)
$$ Tolerance(t) = 1 - e^{-\alpha \cdot \int C(t) dt} $$

*Calculates how the body adapts to the substance over time.*

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/substances` | Returns list of substances with PK parameters. |
| `POST` | `/api/simulate` | Runs the simulation engine. Body: `{ substanceId, dose, weight, doses, interval }` |

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
