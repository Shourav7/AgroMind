🌱 Agro Assistant Web App

A web-based agricultural assistant that provides:

Plant Disease Detection using deep learning (Keras/TensorFlow).

Crop Recommendation based on soil and environmental parameters using a Decision Tree model.

Weather Forecast using OpenWeatherMap API.

Backend is built with Flask and deployed on Render. Frontend can be hosted on Netlify or any static hosting.

🔹 Features
1️⃣ Plant Disease Detection

Upload an image of a plant leaf.

Model predicts disease class (e.g., Tomato Leaf Mold).

Provides recommendation or treatment guidance.

2️⃣ Crop Recommendation

Input soil parameters: N, P, K, pH, temperature, humidity, rainfall.

Decision Tree model predicts best crop to grow.

3️⃣ Weather Forecast

Input a city name.

Returns:

Current weather

Hourly forecast (next 12 time points)

Daily forecast (next 7 days)

🛠 Tech Stack

Backend: Python, Flask, TensorFlow, Keras, scikit-learn, Pillow, NumPy, Pandas

Frontend: HTML / CSS / JS (React/Vite optional)

Deployment: Render (backend), Netlify (frontend)

Database: None (all models loaded from files)

API: OpenWeatherMap for weather data

🔹 Project Structure
agro-app/
│
├─ app.py               # Flask backend
├─ model.h5             # Keras plant disease model
├─ DecisionTree.pkl     # Crop recommendation model
├─ scaler.pkl           # Optional scaler for crop features
├─ requirements.txt     # Python dependencies
├─ .env                 # Environment variables (e.g., OPENWEATHER_API_KEY)
├─ frontend/            # Optional frontend folder (React/Vite)
│   └─ build/           # Production build folder for Netlify
└─ README.md            # Project documentation

⚙️ Setup Instructions
1. Clone the repository
git clone https://github.com/<your-username>/agro.git
cd agro

2. Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
.venv\Scripts\activate     # Windows

3. Install dependencies
pip install -r requirements.txt

4. Set environment variables

Create a .env file:

OPENWEATHER_API_KEY=your_openweather_api_key_here

5. Run locally
python app.py


Backend will run at: http://127.0.0.1:5000

📡 API Endpoints
1️⃣ Weather Full

GET /api/weather_full?location=<city_name>

Example:

curl "https://agro-5hga.onrender.com/api/weather_full?location=Dhaka"


Response:

{
  "location": "Dhaka",
  "current": { ... },
  "hourly": [ ... ],
  "daily": [ ... ]
}

2️⃣ Detect Disease

POST /api/detect_disease

Form Data:

image: plant leaf image file

Example (Python):

import requests
files = {"image": open("leaf.jpg","rb")}
response = requests.post("https://agro-5hga.onrender.com/api/detect_disease", files=files)
print(response.json())


Response:

{
  "disease": "Tomato___Leaf_Mold",
  "recommendation": "Follow recommended treatment for this disease."
}

3️⃣ Recommend Crop

POST /api/recommend_crop

JSON Body:

{
  "N": 90,
  "P": 40,
  "K": 40,
  "temperature": 25,
  "humidity": 80,
  "ph": 6.5,
  "rainfall": 100
}


Example (Python):

import requests
data = { ... }  # JSON data above
response = requests.post("https://agro-5hga.onrender.com/api/recommend_crop", json=data)
print(response.json())


Response:

{
  "recommended_crop": "rice"
}

🚀 Deployment
Backend on Render

Push code to GitHub.

Create a Web Service on Render.

Connect GitHub repo and deploy.

Add .env environment variables in Render settings.

Access API: https://agro-5hga.onrender.com/

Frontend on Netlify

Build frontend (npm run build if React/Vite).

Drag-and-drop build/ folder into Netlify.

Update API URLs in frontend to use Render backend.

🎨 App Design

User Flow:

Home / Dashboard

Weather card

Quick links: Disease Detection, Crop Recommendation

Disease Detection

Upload leaf image

Display disease result + recommendation

Crop Recommendation

Form input: soil + environment parameters

Predict best crop

Weather Forecast

Input city name

Show current, hourly, daily weather

Frontend UI: Clean, responsive, and mobile-friendly.
Backend: Lightweight Flask API serving JSON responses.

📂 Notes

Make sure to keep model.h5 and DecisionTree.pkl in the repo or render storage.

Use POST for /detect_disease and /recommend_crop.

Use GET for /weather_full.

📝 License

MIT License © 2025 [Shourav Das]