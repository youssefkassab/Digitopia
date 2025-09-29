import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Navbar from "./components/Navbar";
import PosterSlider from "./components/PosterSlider";
import Classroom from "./components/Classroom";
import Courses from "./components/Courses";
import Community from "./components/Community";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Dashboard from "./components/Dashboard";
import Banner1 from "./components/Banner1";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Footer from "./components/Footer";
import AIpage from "./components/AI-UI";
import Games from "./components/Games.jsx";
import "./index.css";

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Landing page */}
        <Route
          path="/"
          element={
            <>
              <Helmet>
                <title>Home | 3lm Quest</title>
                <meta
                  name="description"
                  content="Welcome to the homepage of 3lm Quest"
                />
              </Helmet>
              <PosterSlider />
              <Banner1 />
            </>
          }
        />

        {/* Main routes */}
        <Route
          path="/classroom"
          element={
            <>
              <Helmet>
                <title>Classroom | 3lm Quest</title>
              </Helmet>
              <Classroom />
            </>
          }
        />
        <Route path="/courses" element={<Courses />} />
        <Route path="/games" element={<Games />} />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/support" element={<ContactUs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/questro" element={<AIpage />} />

        {/* Auth routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Catch-all */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}
