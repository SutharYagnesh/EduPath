"use client"

import { motion } from "framer-motion"
import { CardContainer, CardBody, CardItem } from "../components/ui/3d-card"
import { TextHoverEffect } from "../components/ui/text-hover-effect"
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect"
import { Spotlight } from "../components/ui/spotlight"
import { BackgroundBeams } from "../components/ui/background-beams"
import { Nav } from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
function Home() {
  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <Spotlight className="top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <BackgroundBeams />
      </div>

      <div className="fixed inset-0 z-0 opacity-5">
        <TextHoverEffect text="EDUPATH" className="h-screen" />
      </div>
      <Nav/>
      {/* HERO SECTION */}
      <section
        id="home"
        className="flex flex-col justify-center items-center text-center min-h-screen px-6 relative z-10 pt-20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-white to-gray-400 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </motion.div>

        <TypewriterEffectSmooth
          words={[
            { text: "Unlock", className: "text-white" },
            { text: "Your", className: "text-white" },
            { text: "Future", className: "text-white" },
            { text: "with", className: "text-white" },
            {
              text: "EDUpath",
              className: "text-gray-400 bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent",
            },
          ]}
          className="text-4xl md:text-7xl font-extrabold leading-tight max-w-5xl"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed"
        >
          AI-powered PDF summaries, roadmap suggestions, curated courses, YouTube insights, job role matching, and the
          best AI tool suggestions — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
          
        >
          <button className="group px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <span className="flex items-center gap-2">
               <a href="/signup" className="text-black"> Get Started </a> 
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16"
        >
        </motion.div>
      </section>


      {/* 3D CARDS FEATURES */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900 px-6 md:px-16 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          Why Choose{" "}
          <span className="bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent">EDUpath?</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {features.slice(0, 3).map((feature, index) => (
            <CardContainer key={index} className="inter-var">
              <CardBody className="bg-gray-900/50 relative group/card hover:shadow-2xl hover:shadow-white/[0.1] bg-black border-white/[0.2] w-auto sm:w-[30rem] h-auto rounded-xl p-8 border backdrop-blur-sm">
                <CardItem translateZ="50" className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </CardItem>
                <CardItem as="p" translateZ="60" className="text-gray-300 text-sm max-w-sm mt-2 leading-relaxed">
                  {feature.description}
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                    {feature.icon}
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>

      {/* ADDITIONAL FEATURES */}
      <section className="py-24 bg-black px-6 md:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {features.slice(3).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
              className="group bg-gradient-to-br from-gray-900/50 to-black/50 p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 shadow-lg hover:shadow-xl backdrop-blur-sm transform hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-gray-100 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gradient-to-b from-black via-gray-900 to-black px-6 md:px-20 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          How It <span className="bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent">Works</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 * index }}
              className="relative p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl shadow-lg hover:border-white/30 transition-all duration-500 backdrop-blur-sm group hover:-translate-y-2"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-100 transition-colors">
                {step.step}
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-gradient-to-r from-black via-gray-900 to-black relative z-10">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Ready to Transform Your Learning?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 leading-relaxed"
          >
            Join thousands of learners who are already accelerating their careers with AI-powered education.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="group px-10 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="flex items-center gap-2">
                Start Free Trial
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button className="px-10 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
              Schedule Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer/>
    </div>
  )
}

// Data constants
const features = [
  {
    title: "PDF Summaries",
    description:
      "Upload PDFs and get instant AI-generated summaries with key insights and actionable takeaways in seconds.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M7 7h10M7 11h10M7 15h7M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
      </svg>
    ),
  },
  {
    title: "Smart Roadmaps",
    description: "Get personalized learning and career roadmaps tailored to your goals, skills, and industry trends.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.168v10.764a1 1 0 01-.553.894L15 17l-6-3z" />
      </svg>
    ),
  },
  {
    title: "Curated Learning",
    description: "Access hand-picked courses and YouTube content from top educators and industry experts worldwide.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M15 10l4.553-2.276a1 1 0 011.447.894v6.764a1 1 0 01-1.447.894L15 14m-6-4v8m0-8L3 6m6 4l6 4" />
      </svg>
    ),
  },
  {
    title: "AI Tool Finder",
    description: "Describe your project or idea and discover the perfect AI tools to bring your vision to life.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Career Matching",
    description:
      "Discover your ideal career roles using advanced AI analysis of your skills, interests, and market demand.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "AI Mentorship",
    description:
      "Get personalized career coaching, study plans, and expert guidance powered by advanced AI algorithms.",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
]

const steps = [
  {
    step: "Upload & Input",
    description: "Upload your PDFs, documents, or simply describe your learning goals and career aspirations.",
  },
  {
    step: "AI Analysis",
    description:
      "Our advanced AI analyzes your content, skills, preferences, and market trends to understand your needs.",
  },
  {
    step: "Personalized Results",
    description: "Receive tailored summaries, learning paths, course recommendations, and career guidance instantly.",
  },
]

const gridCards = [
  {
    id: 1,
    title: "AI-Powered Learning Revolution",
    description:
      "Experience the future of education with our cutting-edge AI technology that adapts to your learning style.",
    className: "md:col-span-2",
  },
  {
    id: 2,
    title: "Expert Career Guidance",
    description: "Get personalized career advice from industry experts and AI mentors.",
   
    className: "col-span-1",
  },
  {
    id: 3,
    title: "Curated Course Library",
    description: "Access thousands of hand-picked courses from top universities and platforms.",
    
    className: "col-span-1",
  },
  {
    id: 4,
    title: "Smart Document Analysis",
    description: "Transform any PDF into actionable insights with our advanced AI summarization technology.",
  
    className: "md:col-span-2",
  },
]

export default Home
