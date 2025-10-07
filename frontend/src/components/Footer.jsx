import React from "react";
import { Facebook, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr"; // handle RTL
  };

  return (
    <footer
      data-nosnippet
      className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
    >
      <div className="footer-wrapper max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Language Section */}
        <div className="footer-card space-y-3">
          <h2 className="font-semibold text-lg">{t("footer.language")}</h2>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => changeLanguage("en")}
              className={`LangSwitch-button ${
                i18n.language === "en" ? "active" : ""
              }`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage("ar")}
              className={`LangSwitch-button ${
                i18n.language === "ar" ? "active" : ""
              }`}
            >
              العربية
            </button>
          </div>
        </div>

        {/* Pages Section */}
        <div className="footer-card space-y-3">
          <h2 className="font-semibold text-lg">{t("footer.pages")}</h2>
          <nav>
            <ul className="space-y-1">
              <li>
                <Link to="/" className="hover:underline">
                  {t("footer.home")}
                </Link>
              </li>
              <li>
                <Link to="/classroom" className="hover:underline">
                  {t("footer.classroom")}
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:underline">
                  {t("footer.courses")}
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:underline">
                  {t("footer.games")}
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:underline">
                  {t("footer.community")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:underline">
                  {t("footer.contactUs")}
                </Link>
              </li>
              <li>
                <Link to="/questro" className="hover:underline">
                  {t("footer.questro")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Social Section */}
        <div className="footer-card space-y-3">
          <h2 className="font-semibold text-lg">{t("footer.followUs")}</h2>
          <div className="flex space-x-3 rtl:space-x-reverse">
            <a
              href="https://www.facebook.com/profile.php?id=61580229761210"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              <Facebook size={24} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-pink-500 transition-colors"
            ></a>
            <a
              href="https://youtube.com/@3lmquest?si=7lWU9DjZGcvtmzyi"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-600 transition-colors"
            >
              <Youtube size={24} />
            </a>
          </div>
        </div>

        {/* Contact Section */}
        <div className="footer-card space-y-3">
          <h2 className="font-semibold text-lg">{t("footer.contact")}</h2>
          <p>Email: edudevexperts@gmail.com</p>
        </div>
      </div>

      <div className="footer-bottom text-center py-4 border-t border-gray-300 dark:border-gray-700 mt-6 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">3lm Quest</span> |{" "}
        {t("footer.allRights")}
      </div>
    </footer>
  );
};

export default Footer;
