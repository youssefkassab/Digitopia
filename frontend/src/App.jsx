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

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <>
      <FloatingIcons />
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
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
        <Footer />
      </AnimatePresence>
    </>
  );
}

const App = () => (
  <Router>
    <Navbar />
    <AnimatedRoutes />
  </Router>
);

export default App;
