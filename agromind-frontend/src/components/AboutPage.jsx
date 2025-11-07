// src/components/AboutPage.jsx
import React from "react";
import { motion } from "framer-motion";
import { Leaf, Heart, Users, Globe, Zap } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 via-emerald-50 to-green-50 pt-24 px-4 pb-20 overflow-hidden">

      {/* Soft morning glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 60, repeat: Infinity }}
          className="absolute inset-0 opacity-50"
          style={{
            background: "radial-gradient(circle at 50% 15%, #f0fdf4 0%, transparent 70%)",
            backgroundSize: "200% 200%"
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto space-y-16">

        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-black text-emerald-800">
            About AgroMind
          </h1>
          <p className="text-2xl md:text-3xl text-emerald-600 mt-4 font-medium">
            Built by farmers, for farmers
          </p>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <Leaf className="w-20 h-20 text-emerald-600 mx-auto mt-6" />
          </motion.div>
        </motion.div>

        {/* Mission & Team */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ y: -10, scale: 1.03 }}
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-xl border-2 border-emerald-200 p-10"
          >
            <Heart className="w-16 h-16 text-emerald-600 mb-6" />
            <h3 className="text-3xl font-bold text-emerald-800 mb-4">Our Mission</h3>
            <p className="text-lg text-emerald-700 leading-relaxed">
              To empower every Bangladeshi farmer with free AI tools that increase yield, reduce loss, and bring dignity to farming.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10, scale: 1.03 }}
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-xl border-2 border-emerald-200 p-10"
          >
            <Users className="w-16 h-16 text-emerald-600 mb-6" />
            <h3 className="text-3xl font-bold text-emerald-800 mb-4">Who We Are</h3>
            <p className="text-lg text-emerald-700 leading-relaxed">
              A team of Bangladeshi developers, agronomists, and farmers who believe technology should serve the soil, not just the city.
            </p>
          </motion.div>
        </div>

        {/* Free Forever */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="text-center"
        >
          <Globe className="w-32 h-32 mx-auto text-emerald-700 mb-8" />
          <h2 className="text-5xl font-black text-emerald-800 mb-6">
            100% Free • Forever
          </h2>
          <p className="text-xl md:text-2xl text-emerald-700 max-w-3xl mx-auto leading-relaxed">
            No ads. No data selling. No subscription. Just pure help for the hands that feed our nation.
          </p>
        </motion.div>

        {/* Made in Bangladesh */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center"
        >
          <div className="inline-block bg-gradient-to-r from-emerald-600 to-green-600 px-14 py-10 rounded-3xl shadow-2xl">
            <Zap className="w-16 h-16 text-white mx-auto mb-4" />
            <p className="text-4xl font-black text-white">
              Made in Bangladesh
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center py-12 text-emerald-700">
          <p className="text-xl font-bold">
            © 2025 AgroMind • Made with love for every farmer
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;