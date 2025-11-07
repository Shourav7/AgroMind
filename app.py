from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import requests
import os
import io
import pickle
import pandas as pd
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
CORS(app)


OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
if not OPENWEATHER_API_KEY:
    raise ValueError("Missing OPENWEATHER_API_KEY environment variable") # your free key

@app.route("/api/weather_full", methods=["GET"])
def weather_full():
    location = request.args.get("location", "Dhaka")

    # -----------------------------
    # Step 1: Current weather
    # -----------------------------
    current_url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={OPENWEATHER_API_KEY}&units=metric"
    current_resp = requests.get(current_url)
    if current_resp.status_code != 200:
        return jsonify({"error": "Failed to fetch current weather", "details": current_resp.json()}), 500
    current_data = current_resp.json()

    # -----------------------------
    # Step 2: Forecast (5-day, 3-hour interval)
    # -----------------------------
    forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={location}&appid={OPENWEATHER_API_KEY}&units=metric"
    forecast_resp = requests.get(forecast_url)
    if forecast_resp.status_code != 200:
        return jsonify({"error": "Failed to fetch forecast", "details": forecast_resp.json()}), 500
    forecast_data = forecast_resp.json()

    # Extract hourly forecast (next 12 time points)
    hourly = forecast_data.get("list", [])[:12]

    # Extract daily forecast (group by day, take 7 days max)
    daily = {}
    for item in forecast_data.get("list", []):
        date = item["dt_txt"].split(" ")[0]
        if date not in daily:
            daily[date] = item
        if len(daily) >= 7:
            break
    daily = list(daily.values())

    # -----------------------------
    # Return combined data
    # -----------------------------
    return jsonify({
        "location": location,
        "current": current_data,
        "hourly": hourly,
        "daily": daily
    })
MODEL_PATH = "model.h5"
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

model = load_model(MODEL_PATH)
print("Model loaded successfully!")

# -------- Classes & Treatments --------
CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

# Optional: minimal treatments
TREATMENTS = {c: "Follow recommended treatment for this disease." for c in CLASSES}
TREATMENTS["healthy"] = "No action needed."

# -------- Disease Detection Route --------
@app.route("/api/detect_disease", methods=["POST"])
def detect_disease():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    img_file = request.files["image"]

    try:
        print("Received image:", img_file.filename)

        # Read image bytes
        img_bytes = img_file.read()
        print("Image size in bytes:", len(img_bytes))

        # Open and preprocess image
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        img = img.resize((224, 224))
        img_array = np.expand_dims(np.array(img)/255.0, axis=0)
        print("Image array shape:", img_array.shape)

        # Predict
        pred = model.predict(img_array)
        print("Raw prediction:", pred)

        class_idx = int(np.argmax(pred))
        disease_name = CLASSES[class_idx] if class_idx < len(CLASSES) else f"Class index {class_idx}"
        recommendation = TREATMENTS.get(disease_name, "Follow good farming practices.")

        print("Predicted disease:", disease_name)

        return jsonify({
            "disease": disease_name,
            "recommendation": recommendation
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Failed to process image", "details": str(e)}), 500

# Load Decision Tree model or any classifier
CROP_MODEL_PATH = "DecisionTree.pkl"
if not os.path.exists(CROP_MODEL_PATH):
    raise FileNotFoundError(f"Crop model file not found at {CROP_MODEL_PATH}")

with open(CROP_MODEL_PATH, "rb") as f:
    crop_model = pickle.load(f)

# Optional: load scaler if used
SCALER_PATH = "scaler.pkl"
scaler = None
if os.path.exists(SCALER_PATH):
    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)
NUMERIC_FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

# List of crop names in the same order as your model's output
CROP_CLASSES = [
    "apple", "banana", "blackgram", "chickpea", "coconut", "coffee",
    "cotton", "grapes", "jute", "kidneybeans", "lentil", "maize",
    "mango", "mothbeans", "mungbean", "muskmelon", "orange", "papaya",
    "pigeonpeas", "pomegranate", "rice", "watermelon"
]

@app.route("/api/recommend_crop", methods=["POST"])
def recommend_crop():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input provided"}), 400

        # --- Build feature array ---
        feature_values = []
        for feat in NUMERIC_FEATURES:
            val = data.get(feat)
            if val is None:
                return jsonify({"error": f"Missing feature: {feat}"}), 400
            try:
                feature_values.append(float(val))
            except ValueError:
                return jsonify({"error": f"Invalid value for {feat}: {val}"}), 400

        features = np.array(feature_values).reshape(1, -1)

        # --- Apply scaler if exists ---
        if scaler:
            features = scaler.transform(features)

        # --- Make prediction ---
        predicted_idx = crop_model.predict(features)[0]

        # --- Map prediction to crop name ---
        if isinstance(predicted_idx, (np.integer, int)):
            if 0 <= predicted_idx < len(CROP_CLASSES):
                recommended_crop_name = CROP_CLASSES[int(predicted_idx)]
            else:
                recommended_crop_name = str(predicted_idx)
        else:
            recommended_crop_name = str(predicted_idx)

        print("Input features:", feature_values)
        print("Scaled features:" if scaler else "Features:", features)
        print("Predicted index:", predicted_idx)
        print("Recommended crop:", recommended_crop_name)

        return jsonify({"recommended_crop": recommended_crop_name})

    except Exception as e:
        print("Error in recommend_crop:", str(e))
        return jsonify({"error": "Failed to predict crop", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
