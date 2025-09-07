import React from "react";
import { Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer>
      <div className="footer-wrapper">
        {/* Language Section */}
        <div className="footer-card">
          <h2>🌐 Language</h2>
          <div className="footer-lang">English</div>
          <div className="footer-lang">العربية</div>
        </div>

        {/* Pages Section */}
        <div className="footer-card">
          <h2>📌 Pages</h2>
          <nav>
            <ul>
              <li>
                <a href="./">Home</a>
              </li>
              <li>
                <a href="/Classroom">Classroom</a>
              </li>
              <li>
                <a href="/Courses">Courses</a>
              </li>
              <li>
                <a href="/Community">Community</a>
              </li>
              <li>
                <a href="/About">About Us</a>
              </li>
              <li>
                <a href="/Contact">Contact Us</a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Social Section */}
        <div className="footer-card">
          <h2>📢 Follow Us</h2>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/profile.php?id=61580229761210"
              aria-label="Facebook"
              target="_blank"
            >
              <Facebook size={24} />
            </a>
            <a href="#" aria-label="Instagram"></a>
            <a
              href="https://youtube.com/@3lmquest?si=7lWU9DjZGcvtmzyi"
              aria-label="YouTube"
              target="_blank"
            >
              <Youtube size={24} />
            </a>
          </div>
        </div>

        {/* Contact Section */}
        <div className="footer-card">
          <h2>📩 Contact</h2>
          <p>Email: edudevexperts@gmail.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} <span className="brand">3lm Quest</span> |
        All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
