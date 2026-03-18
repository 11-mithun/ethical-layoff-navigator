# Ethical AI Layoff Prediction System

An AI-powered workforce analysis tool built with **React**, **TypeScript**, and **Three.js** that predicts layoff risks while prioritizing fairness, transparency, and ethical considerations.

## Features

- **AI-Driven Predictions** — Simulated ML model scores employees on performance, experience, skills, certifications, attendance, and peer ratings
- **Ethical Metrics Dashboard** — Tracks fairness, transparency, morals, and bias for every prediction
- **Department Visualization** — Pie charts and tables showing layoff impact across departments
- **Ethical Impact Analysis** — Demographic breakdowns (gender, age, department) with risk assessment
- **Retention Recommendations** — AI-generated individual and organizational strategies for at-risk employees
- **Scenario Modeling** — Adjust performance, experience, and skills weights to simulate alternative outcomes
- **Interactive 3D Visualization** — Three.js-powered data exploration with orbit controls
- **CSV Import/Export** — Upload employee data or use built-in sample data; download results as CSV

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI:** shadcn/ui, Tailwind CSS, Radix UI
- **Charts:** Recharts
- **3D:** Three.js with OrbitControls
- **State:** React hooks + TanStack Query

## Getting Started

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the dev server
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── DataVisualization3D.tsx    # 3D scatter plot visualization
│   ├── DepartmentVisualization.tsx # Department pie charts & table
│   ├── EmployeeForm.tsx           # CSV upload with drag & drop
│   ├── EthicalImpactAnalysis.tsx   # Demographic & risk analysis
│   ├── EthicalMetrics.tsx          # Fairness/bias progress bars
│   ├── PredictionResults.tsx       # Main results dashboard
│   ├── RetentionRecommendations.tsx# Retention strategies
│   ├── ScenarioModeling.tsx        # What-if scenario tool
│   └── ThreeScene.tsx              # Background 3D particles
├── data/
│   └── sampleData.ts              # 20 sample employees + CSV export
├── services/
│   └── mlService.ts               # ML prediction engine + CSV parser
└── pages/
    └── Index.tsx                   # Main application page
```

## How It Works

1. **Upload** employee data via CSV or load sample data
2. **Run** the ethical AI analysis
3. **Review** predictions with confidence scores and explanations
4. **Explore** ethical metrics, department breakdowns, and demographic analysis
5. **Model** alternative scenarios by adjusting decision weights
6. **Export** results and recommendations as CSV

## Deployment

Open [Lovable](https://lovable.dev) and click **Share → Publish**.

## License

MIT
