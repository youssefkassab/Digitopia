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
                  content="Master any subject with 3lm Quest — the AI-driven platform revolutionizing Egypt's education through smart, personalized, and interactive learning experiences."
                />
                <meta name="keywords" content="AI education, interactive learning, Egypt education, personalized learning, smart quizzes, educational technology, e-learning platform" />
                <meta name="author" content="3lm Quest Team" />
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
                <meta name="theme-color" content="#2563eb" />
                <meta name="language" content="en" />
                <link rel="canonical" href="https://3lm-quest.hemex.ai/" />
                <meta property="og:url" content="https://3lm-quest.hemex.ai/" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="3lm Quest" />
                <meta property="og:image" content="https://3lm-quest.hemex.ai/favicon/3lm-Quest-logo.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:title" content="3lm Quest — The Future of AI-Powered Education" />
                <meta
                  property="og:description"
                  content="Discover 3lm Quest: the next-generation AI learning platform offering personalized lessons, smart quizzes, and immersive simulations for a smarter way to learn."
                />
                <meta property="twitter:url" content="https://3lm-quest.hemex.ai/" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="https://3lm-quest.hemex.ai/favicon/3lm-Quest-logo.png" />
                <meta name="twitter:title" content="3lm Quest — The Future of AI-Powered Education" />
                <meta name="twitter:description" content="Discover 3lm Quest: the next-generation AI learning platform offering personalized lessons, smart quizzes, and immersive simulations for a smarter way to learn." />
                <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
                <link rel="icon" type="image/png" sizes="48x48" href="/favicon/favicon-48x48.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
                <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
                <link rel="manifest" href="/src/assets/manifest.json" />
                <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
                <script type="application/ld+json">
                  {`
                    {
                      "@context": "https://schema.org",
                      "@type": "Organization",
                      "name": "3lm Quest",
                      "url": "https://3lm-quest.hemex.ai",
                      "logo": "https://3lm-quest.hemex.ai/src/assets/3lm-Quest-logo.png",
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
                <script type="application/ld+json">
                  {`
                    {
                      "@context": "http://schema.org",
                      "@type": "WebSite",
                      "name": "3lm Quest",
                      "url": "https://3lm-quest.hemex.ai/"
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
