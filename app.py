from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import io
from PIL import Image
import numpy as np
import pickle
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# ---------------- ENV ----------------
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
if not OPENWEATHER_API_KEY:
    raise ValueError("Missing OPENWEATHER_API_KEY environment variable")

# ---------------- Models ----------------
MODEL_PATH = "model.h5"  # Keras model
CROP_MODEL_PATH = "DecisionTree.pkl"
SCALER_PATH = "scaler.pkl"

# Load small models immediately (pickle is lightweight)
if not os.path.exists(CROP_MODEL_PATH):
    raise FileNotFoundError(f"Crop model file not found: {CROP_MODEL_PATH}")

with open(CROP_MODEL_PATH, "rb") as f:
    crop_model = pickle.load(f)

scaler = None
if os.path.exists(SCALER_PATH):
    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)

NUMERIC_FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

CROP_CLASSES = [
    "apple","banana","blackgram","chickpea","coconut","coffee",
    "cotton","grapes","jute","kidneybeans","lentil","maize",
    "mango","mothbeans","mungbean","muskmelon","orange","papaya",
    "pigeonpeas","pomegranate","rice","watermelon"
]

# Lazy-load TensorFlow model to save memory
tf_model = None

CLASSES = [
    "Apple___Apple_scab","Apple___Black_rot","Apple___Cedar_apple_rust","Apple___healthy",
    "Blueberry___healthy","Cherry_(including_sour)___Powdery_mildew","Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot","Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight","Corn_(maize)___healthy","Grape___Black_rot",
    "Grape___Esca_(Black_Measles)","Grape___Leaf_blight_(Isariopsis_Leaf_Spot)","Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)","Peach___Bacterial_spot","Peach___healthy",
    "Pepper,_bell___Bacterial_spot","Pepper,_bell___healthy","Potato___Early_blight",
    "Potato___Late_blight","Potato___healthy","Raspberry___healthy","Soybean___healthy",
    "Squash___Powdery_mildew","Strawberry___Leaf_scorch","Strawberry___healthy",
    "Tomato___Bacterial_spot","Tomato___Early_blight","Tomato___Late_blight","Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot","Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot","Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus","Tomato___healthy"
]

TREATMENTS = {c: "Follow recommended treatment for this disease." for c in CLASSES}
TREATMENTS["healthy"] = "No action needed."

# ---------------- Routes ----------------
@app.route("/")
def home():
    return {"status": "ok", "message": "Smart Agro API is live!"}

@app.route("/api/weather_full", methods=["GET"])
def weather_full():
    location = request.args.get("location", "Dhaka")

    try:
        current_resp = requests.get(
            f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={OPENWEATHER_API_KEY}&units=metric"
        )
        current_resp.raise_for_status()
        current_data = current_resp.json()

        forecast_resp = requests.get(
            f"https://api.openweathermap.org/data/2.5/forecast?q={location}&appid={OPENWEATHER_API_KEY}&units=metric"
        )
        forecast_resp.raise_for_status()
        forecast_data = forecast_resp.json()

        hourly = forecast_data.get("list", [])[:12]
        daily = {}
        for item in forecast_data.get("list", []):
            date = item["dt_txt"].split(" ")[0]
            if date not in daily:
                daily[date] = item
            if len(daily) >= 7:
                break
        daily = list(daily.values())

        return jsonify({"location": location, "current": current_data, "hourly": hourly, "daily": daily})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/detect_disease", methods=["POST"])
def detect_disease():
    global tf_model
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    # Lazy-load model on first request
    if tf_model is None:
        from tensorflow.keras.models import load_model
        tf_model = load_model(MODEL_PATH)

    img_file = request.files["image"]
    img = Image.open(io.BytesIO(img_file.read())).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.expand_dims(np.array(img)/255.0, axis=0)

    pred = tf_model.predict(img_array)
    class_idx = int(np.argmax(pred))
    disease_name = CLASSES[class_idx] if class_idx < len(CLASSES) else str(class_idx)
    recommendation = TREATMENTS.get(disease_name, "Follow good farming practices.")

    return jsonify({"disease": disease_name, "recommendation": recommendation})

@app.route("/api/recommend_crop", methods=["POST"])
def recommend_crop():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input provided"}), 400

    feature_values = []
    for feat in NUMERIC_FEATURES:
        val = data.get(feat)
        if val is None:
            return jsonify({"error": f"Missing feature: {feat}"}), 400
        feature_values.append(float(val))

    features = np.array(feature_values).reshape(1, -1)
    if scaler:
        features = scaler.transform(features)

    predicted_idx = crop_model.predict(features)[0]
    recommended_crop_name = CROP_CLASSES[int(predicted_idx)] if 0 <= int(predicted_idx) < len(CROP_CLASSES) else str(predicted_idx)

    return jsonify({"recommended_crop": recommended_crop_name})

# ---------------- Run App ----------------
if __name__ == "__main__":
    # Render expects 0.0.0.0 and port 8080
    app.run(host="0.0.0.0", port=8080)
