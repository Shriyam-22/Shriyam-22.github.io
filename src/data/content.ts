/**
 * Single source of truth for everything the site says about Shriyam.
 * Every fact here comes from the CV (Shriyam_CV.pdf), the GitHub profile
 * README (github.com/Shriyam-22) or a project repository README.
 * Do not add numbers or claims that are not in those sources.
 */
import portrait from '../assets/portrait.webp'
import rePredict from '../assets/re-predict.webp'
import reInsights from '../assets/re-insights.webp'
import bcRoc from '../assets/bc-roc.webp'
import clipping from '../assets/clipping.webp'

export const person = {
  name: 'Shriyam',
  fullName: 'Shriyam Gupta',
  role: 'AI Engineer',
  location: 'Bengaluru, India',
  portrait,
  portraitAlt: 'Portrait of Shriyam in a navy blazer and light blue shirt, standing against a textured grey wall',
  // From the GitHub profile README ("$ whoami")
  thesis: 'I build AI products that hold up in the real world.',
  intro:
    "LLM agents with real tools, guardrails that check the model's work in code, and eval suites that say whether a change made things better or worse. I also ship the software around them, from REST APIs and databases to the interface people actually use.",
  background:
    'I come from test automation, and it shows: I ship with tests that run offline, and back AI claims with evals, not screenshots.',
  method:
    "Each project starts from a real user's problem, not from the model: a support team drowning in “where is my order?”, a PR team losing track of coverage, an investor deciding whether a listing is worth buying.",
  approach: ['Measure first', 'Guardrails in code', 'Ship small, test everything'],
  focus: ['LLM agents', 'Tool calling', 'Retrieval', 'Evals', 'Applied ML', 'MLOps', 'Full-stack'],
  status: 'Open to AI engineering and product engineering roles',
}

/**
 * Contact details. Email, LinkedIn and GitHub are taken from the CV.
 * Change them here and every link on the site follows.
 */
export const contact = {
  email: 'shriyamgopalgupta@gmail.com',
  linkedin: 'https://www.linkedin.com/in/shriyam-gupta-a6a2222b2/',
  github: 'https://github.com/Shriyam-22',
  projectMailSubject: 'Project enquiry',
}

export const skills: { group: string; note: string; items: string[] }[] = [
  {
    group: 'LLMs & Agents',
    note: 'Agents that call real tools, with guardrails and evals around them',
    items: ['LLMs', 'RAG', 'LangChain', 'FAISS', 'Multi-Agent Systems', 'Tool-Calling Agents', 'Guardrails', 'LLM Evals'],
  },
  {
    group: 'Evaluation & Reliability',
    note: 'Where it started: test automation',
    items: ['Test Automation', 'PyTest', 'Vitest', 'Regression Testing', 'Selenium', 'Appium', 'Postman', 'JIRA'],
  },
  {
    group: 'Machine Learning',
    note: 'Classical ML, forecasting and deep learning',
    items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'XGBoost', 'Anomaly Detection', 'Time-Series Forecasting', 'Edge AI', 'Streamlit'],
  },
  {
    group: 'Data & MLOps',
    note: 'From raw data to a registered model',
    items: ['Pandas', 'NumPy', 'EDA', 'Feature Engineering', 'Model Evaluation', 'MLflow Tracking & Registry', 'Plotly'],
  },
  {
    group: 'Backend & Web',
    note: 'The software around the model',
    items: ['FastAPI', 'Django', 'DRF', 'Node.js', 'Express', 'Next.js', 'React', 'REST APIs', 'PostgreSQL', 'Redis'],
  },
  {
    group: 'Cloud & DevOps',
    note: 'Shipping and keeping it running',
    items: ['AWS', 'GCP', 'Docker', 'Docker Compose', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Monitoring & Autoscaling'],
  },
  {
    group: 'Languages',
    note: '',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'C++'],
  },
]

export const experience = [
  {
    role: 'AI Engineer Intern',
    org: 'Labmentix',
    dates: 'Oct 2026 – Nov 2026',
    points: [
      'Engineered Cricbuzz LiveStats, a real-time cricket analytics dashboard using the Cricbuzz API, SQL and Streamlit',
      'Developed an unsupervised ML model clustering Netflix titles, with EDA in Python, to improve content discovery',
      'Built an agentic AI travel-planning assistant with LangChain and Streamlit, deployed on Streamlit Community Cloud',
      'Built a Real Estate Investment Advisor on 250K listings that tells investors whether a property is a good buy and forecasts its 5-year price; XGBoost reached 99.5% accuracy and 0.66% MAPE, with runs tracked in MLflow',
    ],
  },
  {
    role: 'ML Intern',
    org: 'Mobilean Technologies Pvt. Ltd.',
    dates: 'Feb 2026 – May 2026',
    points: [
      'Improved ML decision accuracy by 30% through optimised model architectures and feature engineering',
      'Built scalable ETL pipelines processing 500K+ records/day, reducing latency by 40%',
      'Deployed production APIs handling 5K+ requests/day using FastAPI and Docker',
      'Reduced model drift by 20% via monitoring pipelines and automated retraining workflows',
    ],
  },
]

export const education = {
  school: 'Sir M. Visvesvaraya Institute of Technology (SMVIT)',
  degree: 'B.E. Electronics and Communication',
  grade: 'CGPA 8.2',
  dates: '2022 – 2026',
}

export const achievements = [
  'Solved 200+ DSA problems across Arrays, Dynamic Programming and Graphs',
  'Deployed ML applications on AWS with real-time APIs in production environments',
]

export type CaseStudy = {
  id: string
  index: string
  title: string
  kicker: string
  problem: string
  solution: string
  contribution: string[]
  stack: string[]
  repo?: string
  live?: string
  visual: 'agent-flow' | 'forecast' | 'real-estate' | 'travel' | 'cricket'
  figures?: { value: string; label: string }[]
}

const gh = (r: string) => `https://github.com/Shriyam-22/${r}`

export const caseStudies: CaseStudy[] = [
  {
    id: 'd2c-agent',
    index: '01',
    title: 'D2C Support Agent',
    kicker: 'LLM agents · tool calling · evals',
    problem: 'A support team for an Indian D2C brand drowns in “where is my order?” messages, in English, Hindi and Hinglish.',
    solution:
      'A WhatsApp-style agent that tracks orders, recommends products and answers policy questions, then hands over to a human when it should. Output guardrails ground every price and order status in tool results; a paired Agent Ops Console gives the team the transcript, per-turn traces and a live dashboard.',
    contribution: [
      'FastAPI agent loop with four tools: track_order, search_products, search_policies, escalate_to_human',
      'BM25 / embedding retrieval over the catalogue and store policies',
      '22-case eval suite (tool accuracy, language match, p50/p95 latency, cost) and 37 offline unit tests with a fake LLM',
      'Agent Ops Console: Next.js, Express, PostgreSQL and Redis; CI runs 21 Vitest/Supertest tests and a full-stack smoke test',
    ],
    stack: ['FastAPI', 'Tool calling', 'BM25', 'Next.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
    repo: gh('d2c-support-agent'),
    visual: 'agent-flow',
    figures: [
      { value: '22', label: 'eval cases' },
      { value: '37', label: 'offline unit tests' },
      { value: '3', label: 'languages: English, Hindi, Hinglish' },
    ],
  },
  {
    id: 'forecasting',
    index: '02',
    title: 'Commodity Price Forecasting',
    kicker: 'Time series · Django · FastAPI',
    problem: "Forecast an agricultural commodity's average monthly price 12 months ahead, from 20 years of monthly data.",
    solution:
      'Found that 30 months of the source data were an exact copy of 2007–2010 prices, a hidden copy-paste error that inflated volatility estimates by about 70%. After repairing it, compared 10 model families and 71 tuned SARIMA configurations with rolling-origin backtests and an untouched 12-month holdout.',
    contribution: [
      'Self-matching search that detects the copied block automatically',
      'ARIMA selected: 8.7% MAPE on the holdout, every month inside the 95% interval',
      'Django REST Framework system of record with a model registry and gated retraining',
      'FastAPI real-time inference service, reloaded by Django',
    ],
    stack: ['statsmodels', 'ARIMA / SARIMA', 'LightGBM', 'Django REST Framework', 'FastAPI'],
    repo: gh('price-forecasting-django-fastapi'),
    visual: 'forecast',
  },
  {
    id: 'real-estate',
    index: '03',
    title: 'Real Estate Investment Advisor',
    kicker: 'XGBoost · MLflow · Streamlit',
    problem: 'An investor looking at a listing wants to know two things: is it a good buy, and what will it be worth in five years?',
    solution:
      'An ML app on 250,000 Indian property listings that returns a verdict with a confidence score, a 5-year price forecast and a checklist that explains why. Six models were compared and tracked in MLflow; the best are registered and served in a live Streamlit app.',
    contribution: [
      'Engineered city-relative pricing (price vs city median) and an infrastructure score',
      'XGBoost classifier: 99.5% accuracy, F1 0.996; XGBoost regressor: R² 0.9999, 0.66% MAPE',
      'Four-page app: predict, explore listings, market heatmaps, model performance',
    ],
    stack: ['Pandas', 'Scikit-learn', 'XGBoost', 'MLflow', 'Streamlit'],
    repo: gh('real-estate-investment-advisor'),
    live: 'https://shriyam-realestate-advisor.streamlit.app',
    visual: 'real-estate',
  },
  {
    id: 'travel',
    index: '04',
    title: 'Agentic AI Travel Planner',
    kicker: 'LangChain · tool-calling agent',
    problem:
      'Planning a trip means comparing flights, hotels, attractions, weather and budget across many websites, and hand-made plans often end up unrealistic or over budget.',
    solution:
      'A LangChain tool-calling agent that plans 3–7 day trips in India. It decides which tools to call and in what order, checks live weather, estimates cost and returns a validated JSON itinerary with a readable version, explaining every choice it makes.',
    contribution: [
      'Flight, hotel and places tools with cheapest / fastest / best-value ranking',
      'Live weather from Open-Meteo',
      'Pydantic-validated JSON output plus a human-readable plan, via Streamlit or a CLI',
    ],
    stack: ['LangChain', 'LangGraph', 'Pydantic', 'Open-Meteo', 'Streamlit'],
    repo: gh('agentic-travel-planner'),
    live: 'https://agentic-travel-planner-ne7j5dmse87tvy7hfaag87.streamlit.app/',
    visual: 'travel',
  },
  {
    id: 'cricbuzz',
    index: '05',
    title: 'Cricbuzz LiveStats',
    kicker: 'Python · SQL · Streamlit',
    problem: 'Live cricket data and historical analysis usually live in different places.',
    solution:
      'A multi-page Streamlit dashboard that combines live data from the Cricbuzz Cricket API with a SQL database: live scorecards, player leaderboards, 25 analytical SQL queries and full CRUD. If the API is unreachable or the free quota runs out, pages fall back to the database instead of crashing.',
    contribution: [
      'Live matches with full scorecards, saved to SQL in one click',
      '25 SQL queries from beginner to advanced, each with results and a chart',
      'Validated CRUD forms for players and matches, inside transactions',
    ],
    stack: ['Python', 'SQL', 'Streamlit', 'REST API', 'pandas'],
    repo: gh('cricbuzz_livestats'),
    visual: 'cricket',
  },
]

export const shortWork = [
  {
    title: 'Breast Cancer Diagnosis Predictor',
    line: 'Compared 4 classifiers with 5-fold stratified CV, prioritising malignant recall: 96.5% accuracy, 0.996 ROC-AUC on the held-out test set.',
    stack: 'Scikit-learn · Streamlit',
    repo: gh('breast-cancer-ml'),
    image: bcRoc,
    imageAlt: 'ROC curves comparing the four classifiers',
  },
  {
    title: 'Clipping — Press Coverage Tracker',
    line: 'Zero-dependency full-stack tracker with duplicate detection via URL normalisation and a UNIQUE constraint; 9 API tests in GitHub Actions CI.',
    stack: 'Node.js · SQLite · REST API',
    repo: gh('clipping'),
    image: clipping,
    imageAlt: 'Clipping mobile interface showing totals, a form to log a clip and a list of logged coverage',
  },
]

/** Projects listed on the CV without a public repository. */
export const earlierWork = [
  {
    title: 'Distributed AI Agent System',
    line: 'Multi-agent system coordinating retrieval, reasoning and execution agents; RAG with FAISS; FastAPI and Docker microservices deployed on AWS.',
  },
  {
    title: 'LLM RAG Assistant',
    line: 'RAG pipelines over 100K+ documents, with FAISS vector indexing and optimised query pipelines.',
  },
  {
    title: 'AI-Driven Evaluation & Reliability Framework',
    line: 'AI-assisted evaluation of mobile releases across 50+ device/OS configurations, ML-based failure triage and CI/CD quality gates.',
  },
]

export const images = { rePredict, reInsights }
