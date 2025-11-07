// src/components/AgroAssistant.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Upload, Sparkles, Sun, Droplets, Thermometer, Beaker, CloudRain, Camera } from "lucide-react";

const AgroAssistant = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [diseasePrediction, setDiseasePrediction] = useState(null);
  const [diseaseLoading, setDiseaseLoading] = useState(false);

  const [cropData, setCropData] = useState({
    N: "", P: "", K: "", temperature: "", humidity: "", ph: "", rainfall: "",
  });
  const [cropPrediction, setCropPrediction] = useState(null);
  const [cropLoading, setCropLoading] = useState(false);

  const inputIcons = {
    N: <Leaf className="w-5 h-5 text-green-600" />,
    P: <Sparkles className="w-5 h-5 text-amber-600" />,
    K: <Sun className="w-5 h-5 text-yellow-600" />,
    temperature: <Thermometer className="w-5 h-5 text-red-600" />,
    humidity: <Droplets className="w-5 h-5 text-blue-600" />,
    ph: <Beaker className="w-5 h-5 text-purple-600" />,
    rainfall: <CloudRain className="w-5 h-5 text-cyan-600" />,
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setDiseasePrediction(null);
  };

  const handleDiseaseUpload = async () => {
    if (!selectedImage) return alert("Please select an image!");
    setDiseaseLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/detect_disease", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setDiseasePrediction(data);
    } catch (err) {
      alert("Error detecting disease!");
    } finally {
      setDiseaseLoading(false);
    }
  };

  const handleCropChange = (e) => {
    setCropData({ ...cropData, [e.target.name]: e.target.value });
    setCropPrediction(null);
  };

  const handleCropPredict = async () => {
    for (let key of Object.keys(cropData)) {
      if (!cropData[key]) return alert(`Please fill ${key.toUpperCase()}`);
    }

    setCropLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/recommend_crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(cropData).map(([k, v]) => [k, parseFloat(v)])
          )
        ),
      });
      const data = await response.json();
      setCropPrediction(data.recommended_crop || data.error);
    } catch (err) {
      alert("Error getting recommendation!");
    } finally {
      setCropLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 via-emerald-50 to-green-50 pt-24 px-4 pb-20 overflow-hidden">
      
      {/* Soft morning glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 80, repeat: Infinity }}
          className="absolute inset-0 opacity-50"
          style={{
            background: "radial-gradient(circle at 50% 15%, #f0fdf4 0%, transparent 70%)",
            backgroundSize: "200% 200%"
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto space-y-12">

        {/* Hero */}
        <motion.div initial={{ y: -40 }} animate={{ y: 0 }} className="text-center">
          <h1 className="text-5xl md:text-7xl font-black text-emerald-800">AgroMind</h1>
          <p className="text-xl text-emerald-600 mt-2">Your Smart Farming Assistant</p>
        </motion.div>

        {/* DISEASE DETECTION – NOW SMALL, BEAUTIFUL & FAST */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl border-4 border-emerald-300 p-6 max-w-lg mx-auto"
        >
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-3 bg-emerald-100 px-6 py-3 rounded-full">
              <Leaf className="w-8 h-8 text-emerald-700" />
              <h3 className="text-2xl font-bold text-emerald-800">Disease Detection</h3>
            </div>
          </div>

          <input type="file" accept="image/*" onChange={handleImageChange} id="leaf" className="hidden" />
          
          <label
            htmlFor="leaf"
            className="relative block cursor-pointer group"
          >
            <div className="border-4 border-dashed border-emerald-400 rounded-2xl p-8 text-center transition-all group-hover:border-emerald-500 group-hover:scale-105 bg-gradient-to-br from-emerald-50 to-green-50">
              {selectedImage ? (
                <motion.img
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  src={URL.createObjectURL(selectedImage)}
                  alt="leaf"
                  className="w-full h-48 object-cover rounded-xl shadow-xl border-4 border-emerald-200"
                />
              ) : (
                <>
                  <Camera className="w-16 h-16 mx-auto text-emerald-600 mb-3" />
                  <p className="text-emerald-700 font-bold text-lg">Tap to upload leaf photo</p>
                  <p className="text-emerald-600 text-sm mt-1">Supports JPG, PNG</p>
                </>
              )}
            </div>
          </label>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDiseaseUpload}
            disabled={diseaseLoading || !selectedImage}
            className="mt-6 w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {diseaseLoading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                  <Sparkles className="w-6 h-6" />
                </motion.div>
                Analyzing...
              </>
            ) : (
              <>
                <Leaf className="w-6 h-6" />
                Detect Disease Now
              </>
            )}
          </motion.button>

          <AnimatePresence>
            {diseasePrediction && (
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mt-6 bg-gradient-to-r from-red-500 to-emerald-600 text-white p-6 rounded-2xl shadow-2xl text-center border-4 border-white/30"
              >
                <p className="text-3xl font-extrabold mb-2">{diseasePrediction.disease}</p>
                <p className="text-lg leading-relaxed opacity-95">{diseasePrediction.recommendation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Crop Recommendation – Clean & Compact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl border-4 border-emerald-300 p-8"
        >
          <h3 className="text-2xl font-bold text-emerald-800 mb-6 text-center">
            Best Crop for Your Soil
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.keys(cropData).map((key) => (
              <div key={key} className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  {inputIcons[key]}
                  <span className="text-sm font-bold text-emerald-700">{key.toUpperCase()}</span>
                </div>
                <input
                  type="number"
                  name={key}
                  value={cropData[key]}
                  onChange={handleCropChange}
                  placeholder="0"
                  className="w-full bg-transparent text-lg font-bold text-emerald-800 text-center focus:outline-none"
                />
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCropPredict}
            disabled={cropLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-emerald-600 text-white py-5 rounded-xl font-bold text-xl shadow-2xl"
          >
            {cropLoading ? "Finding Best Crop..." : "Recommend Crop"}
          </motion.button>

          {cropPrediction && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="mt-8 bg-gradient-to-r from-yellow-400 to-emerald-600 text-white p-8 rounded-2xl text-center shadow-2xl"
            >
              <Sparkles className="w-16 h-16 mx-auto mb-3" />
              <p className="text-4xl font-black">{cropPrediction}</p>
              <p className="mt-2 text-lg">Perfect for your land!</p>
            </motion.div>
          )}
        </motion.div>

        <footer className="text-center py-10 text-emerald-700">
          <p className="text-lg font-bold">© 2025 AgroMind • Made for Farmers</p>
        </footer>
      </div>
    </div>
  );
};

export default AgroAssistant;