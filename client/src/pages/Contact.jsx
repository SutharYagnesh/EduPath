"use client"

import { motion } from "framer-motion"
import { Mail, Phone, Clock } from "lucide-react"

function Contact() {
  return (
    <div className="min-h-screen w-screen bg-black overflow-x-hidden text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Contact <span className="bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Have questions or need assistance? We're here to help you succeed on your learning journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-white/40 focus:outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-white/40 focus:outline-none transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-white/40 focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <select className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none transition-colors">
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-white/40 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 text-white">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-lg flex items-center justify-center border border-white/10 flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{info.title}</h3>
                      <p className="text-gray-400 text-sm">{info.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 text-white">Office Locations</h2>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold text-white mb-2">{office.city}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{office.address}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const contactInfo = [
  {
    title: "Email Us",
    details: "support@edupath.ai\ninfo@edupath.ai",
    icon: <Mail className="w-6 h-6 text-white" />,
  },
  {
    title: "Call Us",
    details: "+1 (555) 123-4567\n+1 (555) 987-6543",
    icon: <Phone className="w-6 h-6 text-white" />,
  },
  {
    title: "Business Hours",
    details: "Monday - Friday: 9:00 AM - 6:00 PM PST\nWeekends: 10:00 AM - 4:00 PM PST",
    icon: <Clock className="w-6 h-6 text-white" />,
  },
]

const offices = [
  {
    city: "San Francisco, CA",
    address: "123 Innovation Drive, Suite 400\nSan Francisco, CA 94105",
  },
  {
    city: "New York, NY",
    address: "456 Tech Avenue, Floor 15\nNew York, NY 10001",
  },
  {
    city: "Austin, TX",
    address: "789 Startup Boulevard, Building C\nAustin, TX 73301",
  },
]

export default Contact
