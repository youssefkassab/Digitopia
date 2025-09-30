import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import { toast } from "react-hot-toast";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [upgradingId, setUpgradingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    password: "",
    national_number: "",
    role: "user",
    Grade: "",
  });

  // Fetch all students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get("/admin/students");
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    setDeletingId(id);
    try {
      await adminApi.delete(`/admin/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.success("Student deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.error || "Failed to delete student.");
    } finally {
      setDeletingId(null);
    }
  };

  // Upgrade student to admin
  const handleUpgrade = async (id) => {
    if (
      !window.confirm("Are you sure you want to upgrade this student to admin?")
    )
      return;
    setUpgradingId(id);
    try {
      await adminApi.post("/users/upgradeRole", { id, role: "admin" });
      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.success("Student upgraded to admin successfully.");
    } catch (err) {
      console.error("Upgrade error:", err);
      toast.error(err.response?.data?.error || "Failed to upgrade student.");
    } finally {
      setUpgradingId(null);
    }
  };

  // Add new student
  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await adminApi.post("/users/signup", newStudent);
      toast.success("Student added successfully.");
      setNewStudent({
        name: "",
        email: "",
        password: "",
        national_number: "",
        role: "user",
        Grade: "",
      });
      fetchStudents();
    } catch (err) {
      console.error("Add error:", err);
      toast.error(err.response?.data?.error || "Failed to add student.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="students-container">
      <h2>Students Management</h2>

      {/* Add Student Form */}
      <form className="add-student-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) =>
            setNewStudent({ ...newStudent, name: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newStudent.email}
          onChange={(e) =>
            setNewStudent({ ...newStudent, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newStudent.password}
          onChange={(e) =>
            setNewStudent({ ...newStudent, password: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="National Number"
          value={newStudent.national_number}
          onChange={(e) =>
            setNewStudent({ ...newStudent, national_number: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Grade"
          value={newStudent.Grade}
          onChange={(e) =>
            setNewStudent({ ...newStudent, Grade: e.target.value })
          }
        />
        <button type="submit" disabled={adding}>
          {adding ? "Adding..." : "Add Student"}
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading students...</p>
      ) : students.length === 0 ? (
        <p style={{ textAlign: "center" }}>No students found.</p>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>National Number</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.national_number}</td>
                <td>{student.Grade || "-"}</td>
                <td>
                  <button
                    onClick={() => handleUpgrade(student.id)}
                    disabled={upgradingId === student.id}
                    className="upgrade"
                  >
                    {upgradingId === student.id ? "Upgrading..." : "Upgrade"}
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    disabled={deletingId === student.id}
                    className="delete"
                  >
                    {deletingId === student.id ? "Deleting..." : "Delete"}
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

export default Students;
