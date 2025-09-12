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
import AdminPage from "./AdminPage";

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
                  content="Welcome to the homepage of My App"
                />
              </Helmet>
              <PosterSlider />
              <Banner1 />
            </>
          }
        />

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

        {/* Catch-all */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
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

export default App;
