import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="footer-wrapper">
        <div className="borderless-card">
          <h2>Language</h2>
          <div>English</div>
          <div>العربية</div>
        </div>
        <div className="borderless-card">
            <h2>Pages</h2>
            <nav>
                <a href="./App.jsx">Home</a>
                <a href="Classroom"></a>
                <a href="Courses"></a>
                <a href="About Us"></a>
                <a href=""></a>
                <a href=""></a>
            </nav>
        </div>
        <div className="borderless-card"></div>
        <div className="borderless-card"></div>
      </div>
      © {new Date().getFullYear()} 3lm Quest | All Rights Reserved
    </footer>
  );
};

export default Footer;
