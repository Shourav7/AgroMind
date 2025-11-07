// src/components/WeatherAdvice.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CloudSun, Droplets, Wind, MapPin, Search } from "lucide-react";

const WeatherAdvice = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Dhaka");

  const fetchWeather = async (loc = "Dhaka") => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://agro-5hga.onrender.com/api/weather_full?location=${loc}`

      );
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error(err);
      alert("Weather not available. Try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location);
  }, []);

  const handleSearch = () => {
    if (!location.trim()) return;
    fetchWeather(location);
  };

  const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

  // Leaf + Rain Animation Component
  const LeafRain = () => (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-green-600"
          initial={{ 
            y: -100, 
            x: Math.random() * window.innerWidth,
            rotate: Math.random() * 360
          }}
          animate={{ 
            y: window.innerHeight + 100,
            rotate: Math.random() * 720
          }}
          transition={{
            duration: 8 + Math.random() * 7,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        >
          {Math.random() > 0.5 ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 22h20L12 2z" />
            </svg>
          ) : (
            <Droplets className="w-6 h-6 text-blue-400 opacity-70" />
          )}
        </motion.div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-lime-50 via-emerald-50 to-green-50 flex items-center justify-center pt-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
          <CloudSun className="w-20 h-20 text-emerald-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 via-emerald-50 to-green-50 pt-24 px-4 pb-20 overflow-hidden">
      
      {/* Leaf + Rain Animation */}
      <LeafRain />

      {/* Soft glow */}
      <motion.div
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 60, repeat: Infinity }}
        className="fixed inset-0 -z-20 opacity-40"
        style={{
          background: "radial-gradient(circle at 50% 15%, #f0fdf4 0%, transparent 70%)",
          backgroundSize: "200% 200%"
        }}
      />

      <div className="max-w-5xl mx-auto space-y-10">

        {/* Title with bounce */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-black text-emerald-800">Weather Advice</h1>
          <p className="text-2xl text-emerald-600 mt-3">Best time for your crops</p>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <CloudSun className="w-24 h-24 text-emerald-600 mx-auto mt-4" />
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl mx-auto"
        >
          <div className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl border-4 border-emerald-200 p-4 flex gap-3 items-center">
            <MapPin className="w-9 h-9 text-emerald-600" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter city name"
              className="flex-1 text-xl font-medium text-emerald-800 bg-transparent focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSearch}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl shadow-xl"
            >
              <Search className="w-7 h-7" />
            </motion.button>
          </div>
        </motion.div>

        {/* Current Weather */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl border-4 border-emerald-200 p-8 text-center"
        >
          <h2 className="text-4xl font-bold text-emerald-800">{weather.current.name}</h2>
          <p className="text-xl text-emerald-600 capitalize mt-1">{weather.current.weather[0].description}</p>
          
          <motion.img 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            src={iconUrl(weather.current.weather[0].icon)} 
            alt="weather" 
            className="w-32 h-32 mx-auto my-6"
          />

          <motion.p 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl font-extrabold text-emerald-700"
          >
            {Math.round(weather.current.main.temp)}°C
          </motion.p>

          <div className="flex justify-center gap-12 mt-8 text-emerald-700">
            <motion.div whileHover={{ scale: 1.2 }}>
              <Droplets className="w-10 h-10 mx-auto mb-2" />
              <p className="text-2xl font-bold">{weather.current.main.humidity}%</p>
              <p className="text-sm">Humidity</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.2 }}>
              <Wind className="w-10 h-10 mx-auto mb-2" />
              <p className="text-2xl font-bold">{weather.current.wind.speed} m/s</p>
              <p className="text-sm">Wind</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.8 }}
            className="mt-8 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl p-5 text-xl font-bold"
          >
            {weather.current.main.humidity > 75 
              ? "Perfect day for rice growth!" 
              : "Good time to spray pesticide"}
          </motion.div>
        </motion.div>

        {/* Next 12 Hours */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl border-4 border-emerald-200 p-6"
        >
          <h3 className="text-3xl font-bold text-emerald-800 text-center mb-6">Next 12 Hours</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {weather.hourly.slice(0, 12).map((hour, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-emerald-50 rounded-xl p-4 text-center border-2 border-emerald-200"
              >
                <p className="text-sm font-bold text-emerald-700">
                  {new Date(hour.dt_txt).getHours()}:00
                </p>
                <img src={iconUrl(hour.weather[0].icon)} alt="" className="w-14 h-14 mx-auto my-2" />
                <p className="text-xl font-bold text-emerald-800">
                  {Math.round(hour.main.temp)}°
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 7-Day */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl border-4 border-emerald-200 p-6"
        >
          <h3 className="text-3xl font-bold text-emerald-800 text-center mb-6">7-Day Forecast</h3>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {weather.daily.map((day, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring" }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-b from-emerald-100 to-green-50 rounded-xl p-5 text-center border-4 border-emerald-200"
              >
                <p className="text-sm font-bold text-emerald-700">
                  {new Date(day.dt_txt).toLocaleDateString("en", { weekday: "short" })}
                </p>
                <img src={iconUrl(day.weather[0].icon)} alt="" className="w-16 h-16 mx-auto my-3" />
                <p className="text-2xl font-bold text-emerald-800">
                  {Math.round(day.main.temp)}°
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <footer className="text-center py-10 text-emerald-700">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xl font-bold"
          >
            © 2025 AgroMind • Made for Farmers
          </motion.p>
        </footer>
      </div>
    </div>
  );
};

export default WeatherAdvice;