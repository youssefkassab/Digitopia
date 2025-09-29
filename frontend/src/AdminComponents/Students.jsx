import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import {
  isAdminAuthenticated,
  validateAdminAccess,
} from "../AdminServices/adminAuth";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Check admin access before loading
  useEffect(() => {
    const checkAdmin = async () => {
      const valid = await validateAdminAccess();
      if (!valid || !isAdminAuthenticated()) {
        window.location.href = "/admin/login";
      }
    };
    checkAdmin();
  }, []);

  // === FETCH STUDENTS ===
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/students");

      // ✅ Normalize the response to always be an array
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.students || res.data?.data || [];

      setStudents(data);
      setError("");
    } catch (err) {
      console.error("Fetch students failed:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      } else {
        setError(err.response?.data?.error || "Failed to fetch students.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // === DELETE STUDENT ===
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await adminApi.delete(`/admin/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete student failed:", err);
      setError(err.response?.data?.error || "Failed to delete student.");
    }
  };

  // === UI ===
  return (
    <div className="students-container p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">🎓 Manage Students</h2>

      {error && (
        <p className="text-red-600 mt-4 bg-red-50 p-2 rounded border border-red-200">
          {error}
        </p>
      )}

      {/* Student List */}
      {loading ? (
        <p className="mt-6 text-gray-600">Loading students...</p>
      ) : !Array.isArray(students) || students.length === 0 ? (
        <p className="mt-6 text-gray-600">No students found.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">National ID</th>
                <th className="px-4 py-2 border">Grade</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="text-center hover:bg-gray-50">
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">{student.email}</td>
                  <td className="border px-4 py-2">
                    {student.national_number}
                  </td>
                  <td className="border px-4 py-2">{student.Grade}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Students;
