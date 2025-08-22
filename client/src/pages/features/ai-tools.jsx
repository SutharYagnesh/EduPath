"use client"

import { ResizableNavbar } from "../../components/ui/resizable-navbar"
import { motion } from "framer-motion"
import { Spotlight } from "../../components/ui/spotlight"
import { BackgroundBeams } from "../../components/ui/background-beams"
import { Button } from "../../components/ui/button"

export default function AIToolsFinderPage() {
  return (
    <div className="relative w-screen min-h-screen bg-black text-white overflow-hidden">
      <ResizableNavbar />

      <div className="absolute inset-0 z-0">
        <Spotlight className="top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <BackgroundBeams />
      </div>

      <section className="pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            AI Tools{" "}
            <span className="bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent">Finder</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 leading-relaxed mb-8"
          >
            Discover the perfect AI tools for your projects and workflows. Whether you need image generation, text
            analysis, or automation tools, we'll recommend the best solutions.
          </motion.p>
          <Button className="px-8 py-4 bg-white text-black hover:bg-gray-100 font-semibold text-lg">
            Discover AI Tools
          </Button>
        </div>
      </section>
    </div>
  )
}
