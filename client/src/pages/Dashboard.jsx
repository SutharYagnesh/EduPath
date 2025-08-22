import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IconMessage, IconLogout, IconUser, IconFileUpload } from "@tabler/icons-react";

export default function Dashboard() {
  const { token, role, logout } = useAuth();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    axios.get("http://localhost:5000/api/auth/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMessage(res.data.message))
      .catch(() => setMessage("Unauthorized"));
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 rounded-xl p-8 shadow-lg"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Welcome to Your Dashboard</h2>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <IconLogout size={20} />
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <IconUser size={24} />
                </div>
                <h3 className="text-xl font-semibold">Profile</h3>
              </div>
              <p className="text-gray-400 mb-4">Role: <span className="text-white font-medium">{role}</span></p>
              <p className="text-gray-400 mb-4">{message}</p>
              <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                Edit Profile
              </button>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <IconMessage size={24} />
                </div>
                <h3 className="text-xl font-semibold">AI Assistant</h3>
              </div>
              <p className="text-gray-400 mb-4">Get personalized learning recommendations and answers to your questions.</p>
              <Link to="/chat" className="block w-full">
                <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                  Chat with AI
                </button>
              </Link>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Learning Paths</h3>
              </div>
              <p className="text-gray-400 mb-4">Explore curated learning paths based on your interests and goals.</p>
              <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                Explore Paths
              </button>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <IconFileUpload size={24} />
                </div>
                <h3 className="text-xl font-semibold">Documents</h3>
              </div>
              <p className="text-gray-400 mb-4">Upload and manage your documents for AI-powered analysis.</p>
              <Link to="/documents" className="block w-full">
                <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                  Manage Documents
                </button>
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <p className="text-gray-400">You haven't started any courses yet. Use the AI assistant to get personalized recommendations.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}