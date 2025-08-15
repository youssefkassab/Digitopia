import { AnimatePresence } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import FloatingIcons from "./components/FloatingIcons";
import Signup from "./components/Signup";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <FloatingIcons />
      <Routes location={location} key={location.pathname}>
        <Route path="/signup" element={<Signup />} />
      </Routes>
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
