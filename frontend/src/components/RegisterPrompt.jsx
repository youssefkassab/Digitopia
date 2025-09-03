import React from "react";
import { Link } from "react-router-dom";

const RegisterPrompt = () => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Join our platform today!</h2>
      <p>Create an account to access exclusive features and content.</p>
      <Link
        to="/Signup"
        className="btn btn-primary"
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
        }}
      >
        Register Now
      </Link>
    </div>
  );
};

export default RegisterPrompt;
