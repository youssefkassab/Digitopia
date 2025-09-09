import { AnimatePresence } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import PosterSlider from "./components/PosterSlider";
import FloatingIcons from "./components/FloatingIcons";
import Classroom from "./components/Classroom";
import Courses from "./components/Courses";
import Community from "./components/Community";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Dashboard from "./components/Dashboard";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Footer from "./components/Footer";
import AdminPage from "./AdminPage";

// Handles all routes
function AppRoutes() {
  const location = useLocation();

  // Check if we are inside /admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <FloatingIcons />

      {/* Only show Navbar + Footer if NOT admin */}
      {!isAdminRoute && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Landing page */}
          <Route path="/" element={<PosterSlider />} />

          {/* Main routes */}
          <Route path="/Classroom" element={<Classroom />} />
          <Route path="/Courses" element={<Courses />} />
          <Route path="/Community" element={<Community />} />
          <Route path="/About" element={<AboutUs />} />
          <Route path="/Contact" element={<ContactUs />} />
          <Route path="/Dashboard" element={<Dashboard />} />

          {/* Auth routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Admin route */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Catch-all route */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

// Root component with Router + Navbar + Footer
function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main>
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
