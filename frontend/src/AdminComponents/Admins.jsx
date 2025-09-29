import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import { isAdminAuthenticated } from "../AdminServices/adminAuth";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    masterKey: "",
  });

  // Redirect unauthenticated admins
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      window.location.href = "/admin/login";
    } else {
      fetchAdmins();
    }
  }, []);

  // ===== Email Validation =====
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setError("❌ Invalid email format.");
      return false;
    }
    return true;
  };

  // ===== Password Validation =====
  const validatePassword = (pw) => {
    if (
      pw.length >= 8 &&
      /\d/.test(pw) &&
      /[A-Z]/.test(pw) &&
      /[^A-Za-z0-9]/.test(pw)
    ) {
      return true;
    }
    setError(
      "⚠️ Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
    );
    return false;
  };

  // ===== Fetch Admins =====
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get("/admin/admins");

      // ✅ Backend returns an array of { id, email }
      if (Array.isArray(data)) {
        setAdmins(data);
      } else if (data && typeof data === "object" && data.id && data.email) {
        // handle case if backend ever returns a single admin object
        setAdmins([data]);
      } else {
        console.warn("Unexpected admin data format:", data);
        setAdmins([]);
      }

      setError("");
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch admins.";
      console.error("Admin fetch error:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ===== Add New Admin =====
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !validateEmail(newAdmin.email) ||
      !validatePassword(newAdmin.password) ||
      !newAdmin.masterKey
    )
      return;

    try {
      await adminApi.post("/admin/admins", newAdmin);
      setNewAdmin({ email: "", password: "", masterKey: "" });
      fetchAdmins();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to add admin.";
      setError(msg);
    }
  };

  // ===== Delete Admin =====
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await adminApi.delete(`/admin/admins/${id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to delete admin.";
      alert(msg);
    }
  };

  return (
    <div className="admins-container fade-slide">
      <h2 className="section-title">🛠️ Manage Admins</h2>

      <form className="add-admin-form pop-in" onSubmit={handleAdd}>
        <input
          type="email"
          placeholder="Admin Email"
          value={newAdmin.email}
          required
          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={newAdmin.password}
          required
          onChange={(e) =>
            setNewAdmin({ ...newAdmin, password: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Master Key"
          value={newAdmin.masterKey}
          required
          onChange={(e) =>
            setNewAdmin({ ...newAdmin, masterKey: e.target.value })
          }
        />
        <button type="submit" className="btn-animate">
          ➕ Add Admin
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="loading-text">Loading admins...</p>
      ) : admins.length === 0 ? (
        <p className="no-data-text">No admins found.</p>
      ) : (
        <table className="admins-table fade-in">
          <thead>
            <tr>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="row-animate">
                <td>{admin.email}</td>
                <td>
                  <button
                    className="delete"
                    onClick={() => handleDelete(admin.id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admins;
