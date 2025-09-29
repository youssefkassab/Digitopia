import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import { isAdminAuthenticated } from "../AdminServices/adminAuth";

/**
 * Teachers management page — Admin panel
 * - Fetches all teachers (via /api/admin/teachers)
 * - Allows deleting teachers
 * - Includes role-based access check
 */

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      window.location.href = "/admin/login";
    }
  }, []);

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get("/admin/teachers");

      // ✅ Ensure teachers is always an array, even if backend returns an object or null
      const teachersArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data?.teachers)
        ? data.teachers
        : [];

      setTeachers(teachersArray);
      setError("");
    } catch (err) {
      const message =
        err.response?.data?.error ||
        (err.response?.status === 401
          ? "Session expired. Please log in again."
          : "Failed to fetch teachers.");
      setError(message);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Delete teacher
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );
    if (!confirmDelete) return;

    try {
      await adminApi.delete(`/admin/teachers/${id}`);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete teacher.");
    }
  };

  return (
    <div className="teachers-container fade-slide">
      <h2 className="section-title">Manage Teachers</h2>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">Loading teachers...</p>
      ) : teachers.length === 0 ? (
        <p className="empty">No teachers found.</p>
      ) : (
        <table className="teachers-table fade-in">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>National Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="row-animate">
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.national_number}</td>
                <td>
                  <button
                    className="delete"
                    onClick={() => handleDelete(teacher.id)}
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

export default Teachers;
