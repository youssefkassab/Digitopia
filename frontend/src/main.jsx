import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.jsx";
import AdminPage from "./AdminPage.jsx";

const root = document.getElementById("root");

createRoot(root).render(
  <HelmetProvider>
    <BrowserRouter>
      {window.location.pathname.startsWith("/admin") ? <AdminPage /> : <App />}
    </BrowserRouter>
  </HelmetProvider>
);
