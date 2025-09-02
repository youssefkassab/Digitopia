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
import Footer from "./components/Footer";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <FloatingIcons />
      <Routes location={location} key={location.pathname}>
        {/* Show slider on homepage */}
        <Route path="/App.jsx" element={<PosterSlider />} />
        <Route path="/Classroom" element={<Classroom />} />
        <Route path="/Courses" element={<Courses />} />
        <Route path="/Community" element={<Community />} />
        <Route path="/About" element={<AboutUs />} />
        <Route path="/Contact" element={<ContactUs />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
      <Footer />
    </AnimatePresence>
  );
}

const App = () => (
  <Router>
    <Navbar />
    <AnimatedRoutes />
  </Router>
);

export default App;
