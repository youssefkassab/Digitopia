import React, { useState } from "react";
import { motion } from "framer-motion";


const Banner1 = () => {
  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    ></motion.div>
  );
};

export default Banner1;
