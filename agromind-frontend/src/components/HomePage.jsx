// src/components/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, CloudSun, Brain, Zap } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-lime-100 relative overflow-hidden">

      {/* 🌾 Hero Section with Background Image */}
      <section
        className="relative pt-40 pb-28 text-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/paddy-hero.jpg')",
        }}
      >
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-[1px]"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl font-extrabold text-white drop-shadow-lg"
          >
            AGROMIND
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-2xl md:text-3xl text-green-100 font-semibold mt-6"
          >
            A Farmer’s Dream • Powered by AI
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-lg md:text-xl text-green-50 mt-4 max-w-2xl mx-auto leading-relaxed"
          >
            Detect crop diseases instantly, get smart weather advice, and grow confidently — even offline.
          </motion.p>

          {/* 🚀 CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-8 mt-14"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <Link to="/disease">
              <motion.button
                whileHover={{ scale: 1.07, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-14 py-8 rounded-2xl text-2xl font-bold shadow-lg flex items-center gap-4 hover:shadow-emerald-300/50 border border-white/30"
              >
                <Leaf className="w-10 h-10" />
                Detect Disease
              </motion.button>
            </Link>

            <Link to="/weather">
              <motion.button
                whileHover={{ scale: 1.07, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-14 py-8 rounded-2xl text-2xl font-bold shadow-lg flex items-center gap-4 hover:shadow-orange-300/50 border border-white/30"
              >
                <CloudSun className="w-10 h-10" />
                Weather Guide
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.2, type: "spring", stiffness: 80 }}
            className="mt-16"
          >
            <div className="bg-white/70 backdrop-blur-xl text-emerald-800 px-10 py-6 rounded-full font-bold text-xl md:text-2xl flex items-center justify-center gap-4 shadow-xl border border-emerald-200 mx-auto max-w-md">
              <Zap className="w-8 h-8 animate-pulse text-emerald-600" />
              Works offline • 100% Free
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🌱 Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white/80 to-emerald-50/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {[
            { icon: Leaf, title: "Instant Detection", desc: "Snap a photo → AI finds disease in seconds" },
            { icon: CloudSun, title: "Smart Weather", desc: "Predict rainfall • Plan irrigation better" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ scale: 1.03, y: -6 }}
              className="backdrop-blur-xl bg-white/80 rounded-3xl p-10 shadow-lg border border-emerald-200"
            >
              <f.icon className="w-16 h-16 text-emerald-600 mb-5" />
              <h3 className="text-3xl font-extrabold text-emerald-800 mb-3">
                {f.title}
              </h3>
              <p className="text-lg text-emerald-700">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🧠 AI Insight Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-100/60 to-lime-100/60 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="max-w-3xl mx-auto px-6"
        >
          <Brain className="w-24 h-24 mx-auto mb-6 text-emerald-700" />
          <h2 className="text-5xl font-extrabold text-emerald-800 mb-4">
            Built for Bangladesh 🇧🇩
          </h2>
          <p className="text-lg md:text-xl text-emerald-700 leading-relaxed">
            Trained on local crops like rice, jute, and mango. Recognizes blast, blight, wilt — even offline.
          </p>
        </motion.div>
      </section>

      {/* 🌾 Footer */}
      <footer className="py-16 text-center bg-white/60 backdrop-blur-xl border-t border-emerald-100">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          <p className="text-3xl md:text-4xl font-extrabold text-emerald-800">
            © 2025 <span className="text-emerald-600">AGROMIND</span>
          </p>
          <p className="text-lg md:text-xl text-emerald-700 mt-3">
            Empowering every Bangladeshi farmer 🌱
          </p>
        </motion.div>
      </footer>
    </div>
  );
};

export default HomePage;
