import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import { toast } from "react-hot-toast";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [upgradingId, setUpgradingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    password: "",
    national_number: "",
    role: "teacher",
  });

  // Fetch all teachers
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get("/admin/teachers");
      setTeachers(data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      toast.error("Failed to fetch teachers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Delete teacher
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;
    setDeletingId(id);
    try {
      await adminApi.delete(`/admin/teachers/${id}`);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      toast.success("Teacher deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.error || "Failed to delete teacher.");
    } finally {
      setDeletingId(null);
    }
  };

  // Upgrade teacher to admin
  const handleUpgrade = async (id) => {
    if (
      !window.confirm("Are you sure you want to upgrade this teacher to admin?")
    )
      return;
    setUpgradingId(id);
    try {
      await adminApi.post("/users/upgradeRole", { id, role: "admin" });
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      toast.success("Teacher upgraded to admin successfully.");
    } catch (err) {
      console.error("Upgrade error:", err);
      toast.error(err.response?.data?.error || "Failed to upgrade teacher.");
    } finally {
      setUpgradingId(null);
    }
  };

  // Add new teacher
  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await adminApi.post("/users/signup", newTeacher);
      toast.success("Teacher added successfully.");
      setNewTeacher({
        name: "",
        email: "",
        password: "",
        national_number: "",
        role: "teacher",
      });
      fetchTeachers();
    } catch (err) {
      console.error("Add error:", err);
      toast.error(err.response?.data?.error || "Failed to add teacher.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="students-container">
      <h2>Teachers Management</h2>

      {/* Add Teacher Form */}
      <form className="add-student-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Name"
          value={newTeacher.name}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, name: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newTeacher.email}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newTeacher.password}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, password: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="National Number"
          value={newTeacher.national_number}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, national_number: e.target.value })
          }
          required
        />
        <button type="submit" disabled={adding}>
          {adding ? "Adding..." : "Add Teacher"}
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading teachers...</p>
      ) : teachers.length === 0 ? (
        <p style={{ textAlign: "center" }}>No teachers found.</p>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>National Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.national_number}</td>
                <td>
                  <button
                    onClick={() => handleUpgrade(teacher.id)}
                    disabled={upgradingId === teacher.id}
                    className="upgrade"
                  >
                    {upgradingId === teacher.id ? "Upgrading..." : "Upgrade"}
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    disabled={deletingId === teacher.id}
                    className="delete"
                  >
                    {deletingId === teacher.id ? "Deleting..." : "Delete"}
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
