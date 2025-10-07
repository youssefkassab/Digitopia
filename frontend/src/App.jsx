import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import "./i18n";

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
import Games from "./components/Games";

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
                <title>3lm Quest | AI-Powered Interactive Learning Platform</title>
                <meta
                  name="description"
                  content="Master any subject with 3lm Quest — the AI-driven platform revolutionizing Egypt’s education through smart, personalized, and interactive learning experiences."
                />
                <link rel="canonical" href="https://3lm-quest.hemex.ai" />
                <meta property="og:url" content="https://3lm-quest.hemex.ai" />
                <meta property="twitter:url" content="https://3lm-quest.hemex.ai" />
                <meta property="og:title" content="3lm Quest — The Future of AI-Powered Education" />
                <meta
                  property="og:description"
                  content="Discover 3lm Quest: the next-generation AI learning platform offering personalized lessons, smart quizzes, and immersive simulations for a smarter way to learn."
                />
                <script type="application/ld+json">
                  {`
                    {
                      "@context": "https://schema.org",
                      "@type": "Organization",
                      "name": "3lm Quest",
                      "url": "https://3lm-quest.hemex.ai",
                      "logo": "https://www.3lmquest.com/assets/logo.png",
                      "description": "Master any subject with 3lm Quest — the AI-driven platform revolutionizing Egypt’s education through smart, personalized, and interactive learning experiences.",
                      "foundingDate": "2025",
                      "founders": [
                        {
                          "@type": "Person",
                          "name": "Youssef Kassab"
                        }
                      ],
                      "sameAs": [
                        "https://www.facebook.com/3lmQuest",
                        "https://www.linkedin.com/company/3lmQuest",
                        "https://twitter.com/3lmQuest"
                      ],
                      "contactPoint": {
                        "@type": "ContactPoint",
                        "contactType": "customer support",
                        "email": "support@3lmquest.com"
                      }
                    }
                  `}
                </script>
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
        <Route path="/Courses" element={<Courses />} />
        <Route path="/Community" element={<Community />} />
        <Route path="/games" element={<Games />} />
        <Route path="/About" element={<AboutUs />} />
        <Route path="/support" element={<ContactUs />} />
        <Route path="/Dashboard" element={<Dashboard />} />
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
  const location = useLocation();
  const { i18n } = useTranslation();

  // Handle RTL for Arabic
  useEffect(() => {
    document.documentElement.lang = i18n.language; // set lang attribute
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div className="app-wrapper">
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      {/* Hide Footer only on /AI */}
      {location.pathname !== "/questro" && <Footer />}
    </div>
  );
}
