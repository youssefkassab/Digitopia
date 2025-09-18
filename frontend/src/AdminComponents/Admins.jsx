import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import { isAdminAuthenticated, adminLogout } from "../AdminServices/adminAuth";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    masterKey: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      window.location.href = "/admin/login";
    } else {
      fetchAdmins();
    }
  }, []);

  // ===== Validations =====
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    return true;
  };

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
      "Password must be 8+ chars, include uppercase, number, and symbol."
    );
    return false;
  };

  // ===== Fetch Admins =====
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get("/admin/admins");
      setAdmins(data);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        await adminLogout();
        window.location.href = "/admin/login";
      } else {
        setError(err.response?.data?.error || "Failed to fetch admins.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== Add Admin =====
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
      setError(err.response?.data?.error || "Failed to add admin.");
    }
  };

  // ===== Delete Admin =====
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await adminApi.delete(`/admin/admins/${id}`);
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete admin.");
    }
  };

  return (
    <div className="admins-container fade-slide">
      <h2 className="section-title">Manage Admins</h2>

      <form className="add-admin-form pop-in" onSubmit={handleAdd}>
        <input
          type="email"
          placeholder="Email"
          value={newAdmin.email}
          required
          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
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
          Add Admin
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">Loading...</p>
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
                    Delete
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
