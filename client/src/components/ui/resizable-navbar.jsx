"use client"

import { useState, useEffect } from "react"
// Remove Next.js UI components as they don't exist in this React project
// Using standard HTML elements instead
import { ChevronDown, Menu, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

// Export all the components that are being imported in Navbar.jsx
export const Navbar = ({ children }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </nav>
  )
}

export const NavBody = ({ children }) => {
  return (
    <div className="flex items-center justify-between">
      {children}
    </div>
  )
}

export const MobileNav = ({ children }) => {
  return (
    <div className="md:hidden">
      {children}
    </div>
  )
}

export const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
        <span className="text-black font-bold text-lg">E</span>
      </div>
      <span className="text-white font-bold text-xl">EDUpath</span>
    </Link>
  )
}

export const NavbarButton = ({ children, variant = "primary", className = "", ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md transition-colors"
  const variantClasses = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "text-gray-300 hover:text-white hover:bg-gray-800"
  }


  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export const MobileNavHeader = ({ children }) => {
  return (
    <div className="flex items-center justify-between py-4">
      {children}
    </div>
  )
}

export const MobileNavToggle = ({ isOpen, onClick }) => {
  return (
    <button className="text-white" onClick={onClick}>
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  )
}

export const MobileNavMenu = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null
  
  return (
    <div className="mt-4 pb-4 border-t border-gray-800">
      <div className="flex flex-col space-y-4 pt-4">
        {children}
      </div>
    </div>
  )
}

// Main navbar component
export function ResizableNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const featuresItems = [
    { name: "PDF Summary", href: "/features/pdf-summary" },
    { name: "Roadmap Suggestions", href: "/features/roadmap-suggestions" },
    { name: "Courses Finder", href: "/features/courses-finder" },
    { name: "Job Finder", href: "/features/job-finder" },
    { name: "AI Tools Finder", href: "/features/ai-tools-finder" },
    { name: "Chat Bot", href: "/chat" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-md border-b border-gray-800 py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">E</span>
            </div>
            <span className="text-white font-bold text-xl">EDUpath</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>

            <div className="relative group">
              <div className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors cursor-pointer">
                <span>Features</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="absolute left-0 mt-2 w-48 bg-black border border-gray-800 rounded shadow-lg hidden group-hover:block">
                {featuresItems.map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.href} 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/chat" className="text-gray-300 hover:text-white transition-colors">
              Chat with AI
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4 pt-4">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>

              <div className="space-y-2">
                <span className="text-gray-300 font-medium">Features</span>
                <div className="pl-4 space-y-2">
                  {featuresItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/chat" className="text-gray-300 hover:text-white transition-colors">
                Chat with AI
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>

              <AuthButtons />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function AuthButtons() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate('/login');
  };

  if (isLoggedIn) {
    return (
      <button
        onClick={handleLogout}
        className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
      >
        Logout
      </button>
    );
  } else {
    return (
      <div className="flex items-center space-x-4">
        <Link to="/login">
          <button className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-md transition-colors">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md transition-colors">
            Sign Up
          </button>
        </Link>
      </div>
    );
  }
}
