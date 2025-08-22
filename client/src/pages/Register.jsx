import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/auth/signup", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="min-h-screen w-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#111] p-8 rounded-md shadow-lg border border-gray-800"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold">
            Edu<span className="text-white">Path</span>
          </Link>
          <h2 className="text-2xl font-bold mt-6 mb-2">Create Account</h2>
          <p className="text-gray-400">Join us and start your learning journey</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-black border border-gray-800 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-black border border-gray-800 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-black border border-gray-800 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-gray-200 text-black font-medium py-3 rounded-md transition-colors duration-300 flex items-center justify-center"
          >
            {loading ? (
              <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : null}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#111] text-gray-400">Or continue with</span>
          </div>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-black text-white font-medium py-3 rounded-md border border-gray-800 transition-colors duration-300 flex items-center justify-center hover:bg-[#222]"
        >
          <IconBrandGoogle className="mr-2" size={20} />
          Sign up with Google
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-gray-400 hover:text-white font-medium underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}