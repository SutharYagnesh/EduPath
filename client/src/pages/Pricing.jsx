"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

function Pricing() {
  return (
    <div className="min-h-screen w-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple{" "}
            <span className="bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan for your learning journey. Start free and upgrade as you grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`bg-gradient-to-br from-gray-900/50 to-black/50 p-8 rounded-2xl border backdrop-blur-sm relative ${
                plan.popular ? "border-white/40 transform scale-105" : "border-white/10 hover:border-white/30"
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? "text-white" : "text-gray-500"}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? "bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    : "bg-gray-800 text-white hover:bg-gray-700 border border-white/20 hover:border-white/40"
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqData.map((faq, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const pricingPlans = [
  {
    name: "Starter",
    price: "0",
    period: "month",
    description: "Perfect for getting started with AI-powered learning",
    popular: false,
    buttonText: "Get Started Free",
    features: [
      { name: "5 PDF summaries per month", included: true },
      { name: "Basic roadmap suggestions", included: true },
      { name: "Course recommendations", included: true },
      { name: "Community support", included: true },
      { name: "Advanced AI tools", included: false },
      { name: "Priority support", included: false },
      { name: "Custom integrations", included: false },
    ],
  },
  {
    name: "Professional",
    price: "29",
    period: "month",
    description: "Ideal for serious learners and professionals",
    popular: true,
    buttonText: "Start Free Trial",
    features: [
      { name: "Unlimited PDF summaries", included: true },
      { name: "Advanced roadmap suggestions", included: true },
      { name: "Personalized course finder", included: true },
      { name: "Job matching algorithm", included: true },
      { name: "AI tools recommendations", included: true },
      { name: "Priority email support", included: true },
      { name: "Custom integrations", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: "99",
    period: "month",
    description: "For teams and organizations",
    popular: false,
    buttonText: "Contact Sales",
    features: [
      { name: "Everything in Professional", included: true },
      { name: "Team collaboration tools", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom AI model training", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "24/7 phone support", included: true },
      { name: "Custom integrations", included: true },
    ],
  },
]

const faqData = [
  {
    question: "Can I change my plan anytime?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a 14-day free trial for the Professional plan. No credit card required to get started.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.",
  },
]

export default Pricing
