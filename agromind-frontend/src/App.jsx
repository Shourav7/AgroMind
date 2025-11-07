// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X } from "lucide-react";

import HomePage from "./components/HomePage";
import DiseaseDetection from "./components/DiseaseDetection";
import WeatherAdvice from "./components/WeatherAdvice";
import AboutPage from "./components/AboutPage";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/disease", label: "Disease Detection" },
    { path: "/weather", label: "Weather Advice" },
    { path: "/about", label: "About" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl">
      <div className="bg-white/70 border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              className="bg-gradient-to-br from-emerald-400 to-green-500 p-2.5 rounded-xl shadow-lg"
            >
              <Leaf className="w-9 h-9 text-white" />
            </motion.div>
            <span className="text-3xl font-black text-emerald-800">AGROMIND</span>
          </Link>

          <nav className="hidden md:flex gap-12">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.div whileHover={{ y: -2 }} className="relative">
                  <span className={`text-lg font-semibold ${location.pathname === item.path ? "text-emerald-700" : "text-emerald-600"}`}>
                    {item.label}
                  </span>
                  {location.pathname === item.path && (
                    <motion.div layoutId="navline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </motion.div>
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-emerald-700 p-2 bg-white/60 rounded-lg"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden bg-white/80 backdrop-blur-xl border-t border-emerald-200"
          >
            <nav className="px-6 py-10 space-y-6">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                  <div className="text-3xl font-bold text-emerald-700 text-center">
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const App = () => {
  return (
    <Router>
      {/* Light paddy morning */}
      <div className="min-h-screen bg-gradient-to-b from-lime-50 via-emerald-50 to-green-50">
        <Navigation />

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/disease" element={<DiseaseDetection />} />
            <Route path="/weather" element={<WeatherAdvice />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default App;