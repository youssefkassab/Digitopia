import React, { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | 3lm Quest</title>
      </Helmet>
      <motion.div
        className="page-container"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="card">
          <h1>Coming Soon</h1>
        </div>
      </motion.div>
    </>
  );
};

export default AdminDashboard;
