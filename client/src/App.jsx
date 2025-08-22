import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { AuthProvider } from "./context/AuthContext.jsx";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

import PdfSummary from "./pages/features/pdf-summary";
import JobFinderPage from "./pages/features/top-job-roles";
import AIToolsFinderPage from "./pages/features/ai-tools";
import RoadmapSuggestionsPage from "./pages/features/roadmap";
import CoursesFinderPage from "./pages/features/courses";
import Pricing from "./pages/Pricing";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />

          <Route path="/features/ai-tools-finder" element={<AIToolsFinderPage />} />
          <Route path="/features/roadmap-suggestions" element={<RoadmapSuggestionsPage />} />
          <Route path="/features/job-finder" element={<JobFinderPage />} />
          <Route path="/features/courses-finder" element={<CoursesFinderPage />} />
          <Route path="/features/pdf-summary" element={<PdfSummary />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
