import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import { toast } from "react-hot-toast";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all users with role = "admin"
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get("/admin/admins");

      // Ensure data is always an array
      if (Array.isArray(data)) {
        setAdmins(data);
      } else if (data && data.id && data.email) {
        setAdmins([data]);
      } else {
        setAdmins([]);
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      toast.error(err.response?.data?.error || "Failed to fetch admins.");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    setDeletingId(id);
    try {
      await adminApi.delete(`/admin/admins/${id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      toast.success("Admin deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.error || "Failed to delete admin.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admins-container">
      <h2>Admins Management</h2>

      {loading ? (
        <p className="loading-text">Loading admins...</p>
      ) : admins.length === 0 ? (
        <p className="no-data-text">No admins found.</p>
      ) : (
        <table className="admins-table">
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
                    disabled={deletingId === admin.id}
                  >
                    {deletingId === admin.id ? "Deleting..." : "🗑️ Delete"}
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
