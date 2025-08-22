"use client"

import { ResizableNavbar } from "../../components/ui/resizable-navbar"
import { motion } from "framer-motion"
import { Spotlight } from "../../components/ui/spotlight"
import { BackgroundBeams } from "../../components/ui/background-beams"
import { Button } from "../../components/ui/button"
import { CardContainer, CardBody, CardItem } from "../../components/ui/3d-card"

export default function PDFSummaryPage() {
  const features = [
    "Extract key insights in seconds",
    "Highlight important data points",
    "Generate actionable takeaways",
    "Support for multiple file formats",
    "Export summaries to various formats",
    "Smart categorization of content",
  ]

  const useCases = [
    {
      title: "Research Papers",
      description: "Quickly understand complex academic papers and extract key findings for your research.",
      icon: "📄",
    },
    {
      title: "Business Reports",
      description: "Get executive summaries of lengthy business documents and financial reports.",
      icon: "📊",
    },
    {
      title: "Study Materials",
      description: "Transform textbooks and study guides into concise, reviewable summaries.",
      icon: "📚",
    },
  ]

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
            PDF <span className="bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent">Summary</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 leading-relaxed mb-8"
          >
            Transform lengthy PDFs into concise, actionable summaries using advanced AI. Save 80% of your reading time
            while capturing all the essential information.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button className="px-8 py-4 bg-white text-black hover:bg-gray-100 font-semibold text-lg">
              Try PDF Summary
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <CardContainer key={index} className="inter-var">
                <CardBody className="bg-gray-900/50 border-white/[0.2] w-full h-auto rounded-xl p-6 border backdrop-blur-sm">
                  <CardItem translateZ="50" className="text-center">
                    <div className="text-4xl mb-4">{useCase.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
                    <p className="text-gray-300 text-sm">{useCase.description}</p>
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
