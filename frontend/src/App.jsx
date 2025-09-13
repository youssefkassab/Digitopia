import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";

// --- PLACEHOLDER COMPONENTS (All components are in this single file to prevent errors) ---

const FloatingIcons = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 p-2 bg-blue-500 text-white rounded-full shadow-lg">
      <p>Icons</p>
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-2xl font-bold">My App</h1>
      <div className="flex space-x-4">
        <a href="/" className="hover:text-gray-300">Home</a>
        <a href="/Classroom" className="hover:text-gray-300">Classroom</a>
        <a href="/login" className="hover:text-gray-300">Login</a>
      </div>
    </nav>
  );
};

const PosterSlider = () => {
  return (
    <div className="h-64 bg-gray-200 flex items-center justify-center">
      <h2 className="text-xl">Poster Slider Content</h2>
    </div>
  );
};

const Classroom = () => {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-3xl font-bold">Classroom Page</h2>
      <p className="mt-4">Welcome to the Classroom!</p>
    </div>
  );
};

const Courses = () => {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-3xl font-bold">Courses Page</h2>
      <p className="mt-4">Explore our wide range of courses.</p>
    </div>
  );
};

const Community = () => {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-3xl font-bold">Community Page</h2>
      <p className="mt-4">Join our community and connect with others.</p>
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-3xl font-bold">About Us Page</h2>
      <p className="mt-4">Learn more about our mission.</p>
    </div>
  );
};

const ContactUs = () => {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-3xl font-bold">Contact Us Page</h2>
      <p className="mt-4">Get in touch with us.</p>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <p className="mt-4">Your personalized dashboard.</p>
    </div>
  );
};

const Banner1 = () => {
  return (
    <div className="p-8 bg-green-200 flex items-center justify-center">
      <h2 className="text-xl">Banner 1 Content</h2>
    </div>
  );
};

const Signup = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
      <h2 className="text-3xl font-bold">Signup Page</h2>
    </div>
  );
};

const Login = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
      <h2 className="text-3xl font-bold">Login Page</h2>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="p-4 bg-gray-800 text-white text-center">
      <p>&copy; 2023 My App</p>
    </footer>
  );
};

const AdminPage = () => {
  return (
    <div className="p-8 bg-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold">Admin Home</h2>
      <p className="mt-4">Select an option from the admin dashboard.</p>
    </div>
  );
};

const AdminLessons = () => {
  return (
    <div className="p-8 bg-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold">Admin Lessons</h2>
      <p className="mt-4">Manage your lessons here.</p>
    </div>
  );
};

const AdminStudents = () => {
  return (
    <div className="p-8 bg-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold">Admin Students</h2>
      <p className="mt-4">Manage your students here.</p>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="p-8 bg-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      <p className="mt-4">This is the main admin dashboard.</p>
    </div>
  );
};


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="app-wrapper">
      <FloatingIcons />
      {/* Only show Navbar + Footer if NOT admin */}
      {!isAdminRoute && <Navbar />}
      <main>
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

            {/* Admin routes */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/lessons" element={<AdminLessons />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Catch-all route */}
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
