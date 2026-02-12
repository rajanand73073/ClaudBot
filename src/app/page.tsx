"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-purple-300 to-sky-500 flex items-center justify-center px-6">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900/30 backdrop-blur-xl p-12 rounded-3xl shadow-2xl text-center max-w-2xl"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          Deterministic UI Generator
        </motion.h1>

        <p className="text-white text-lg mb-10 opacity-90">
          Transform natural language into structured, validated, 
          and explainable UI designs.
        </p>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/Generator")}
          className="px-8 py-4 bg-white text-pink-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Create a Design
        </motion.button>
      </motion.div>
    </div>
  )
}
