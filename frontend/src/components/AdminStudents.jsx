import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import FloatingIcons from "./FloatingIcons";
import "./AdminTable.css"; // ✅ reuse the same styling

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    national_number: "",
    role: "",
  });

  // ✅ Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users/user");
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : [data]); // handle single object or array
      setLoading(false);
    } catch (err) {
      console.error("Error fetching students:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await fetch("http://localhost:3000/api/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setStudents(students.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✅ Start editing
  const handleEdit = (student) => {
    setEditingStudent(student.id);
    setFormData({
      id: student.id,
      name: student.name,
      email: student.email,
      national_number: student.national_number,
      role: student.role,
    });
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Save update
  const handleUpdate = async () => {
    try {
      await fetch("http://localhost:3000/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setStudents(
        students.map((s) =>
          s.id === formData.id ? { ...s, ...formData } : s
        )
      );
      setEditingStudent(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="admin-lessons-container">
      <FloatingIcons />
      <AdminNavbar />

      <div className="admin-lessons-content">
        <h1 className="page-title">Students Management</h1>

        {loading ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>National Number</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>

                  {/* Editable fields */}
                  <td>
                    {editingStudent === student.id ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-edit"
                      />
                    ) : (
                      student.name
                    )}
                  </td>
                  <td>
                    {editingStudent === student.id ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-edit"
                      />
                    ) : (
                      student.email
                    )}
                  </td>
                  <td>
                    {editingStudent === student.id ? (
                      <input
                        type="text"
                        name="national_number"
                        value={formData.national_number}
                        onChange={handleChange}
                        className="input-edit"
                      />
                    ) : (
                      student.national_number
                    )}
                  </td>
                  <td>
                    {editingStudent === student.id ? (
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="input-edit"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                      </select>
                    ) : (
                      student.role
                    )}
                  </td>

                  {/* Actions */}
                  <td className="actions">
                    {editingStudent === student.id ? (
                      <button onClick={handleUpdate} className="btn save">
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(student)}
                        className="btn edit"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="btn delete"
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
    </div>
  );
};

export default AdminStudents;
