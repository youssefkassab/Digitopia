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
import Signup from "./components/Signup";
import Login from "./components/Login";
import Footer from "./components/Footer";
import AdminPage from "./AdminPage";
import AdminRoute from "./components/AdminRoute";

// Handles all routes
function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <FloatingIcons />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Landing page */}
          <Route path="/" element={<PosterSlider />} />

          {/* Main routes */}
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Auth routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Admin route (protected) */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Catch-all route */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}

// Root component with Router + Navbar
function App() {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
    </Router>
  );
}

export default App;

