# 🌾 Smart Agro API

A Flask-based backend for:
- 🌦 Weather forecast via OpenWeather API  
- 🌿 Plant disease detection (TensorFlow model)  
- 🌾 Crop recommendation using a Decision Tree model  

### 🧠 Endpoints
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/weather_full?location=Dhaka` | GET | Returns current + forecast weather |
| `/api/detect_disease` | POST | Upload plant leaf image → returns disease name |
| `/api/recommend_crop` | POST | Send soil + weather features → returns crop suggestion |

### 🔧 Run locally
```bash
pip install -r requirements.txt
export OPENWEATHER_API_KEY=your_key_here
python app.py
