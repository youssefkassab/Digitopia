import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import { isAdminAuthenticated, adminLogout } from "../AdminServices/adminAuth";

const tempMailDomains = [
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "dispostable.com",
  "yopmail.com",
];

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    password: "",
    national_number: "",
  });

  // Redirect if admin not authenticated
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      window.location.href = "/admin/login";
    }
  }, []);

  // === VALIDATIONS ===
  const validateName = (name) => {
    const words = name.trim().split(/\s+/);
    if (words.length !== 4) {
      setError("Full name must have exactly 4 words.");
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    const domain = email.split("@")[1].toLowerCase();
    if (tempMailDomains.includes(domain)) {
      setError("Temporary emails are not allowed.");
      return false;
    }
    const allowedDomains = [
      "gmail.com",
      "hotmail.com",
      "yahoo.com",
      "outlook.com",
      "live.com",
    ];
    if (!allowedDomains.includes(domain)) {
      setError("Only Gmail, Hotmail, Yahoo, Outlook, and Live are accepted.");
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
      "Password must be 8+ chars, include an uppercase, a number, and a symbol."
    );
    return false;
  };

  const validateNationalId = (id) => {
    if (!/^\d{14}$/.test(id) || (id[0] !== "2" && id[0] !== "3")) {
      setError("National ID must be 14 digits starting with 2 or 3.");
      return false;
    }
    return true;
  };

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get("/admin/teachers");
      setTeachers(data);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        await adminLogout();
        window.location.href = "/admin/login";
      } else {
        setError(err.response?.data?.error || "Failed to fetch teachers.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Add new teacher
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !validateName(newTeacher.name) ||
      !validateEmail(newTeacher.email) ||
      !validatePassword(newTeacher.password) ||
      !validateNationalId(newTeacher.national_number)
    ) {
      return;
    }

    try {
      await adminApi.post("/admin/teachers", newTeacher);
      setNewTeacher({ name: "", email: "", password: "", national_number: "" });
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add teacher.");
    }
  };

  // Delete teacher
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;

    try {
      await adminApi.delete(`/admin/teachers/${id}`);
      fetchTeachers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete teacher.");
    }
  };

  return (
    <div className="teachers-container fade-slide">
      <h2 className="section-title">Manage Teachers</h2>

      <form className="add-teacher-form pop-in" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Full Name"
          value={newTeacher.name}
          required
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, name: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          value={newTeacher.email}
          required
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, email: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={newTeacher.password}
          required
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, password: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="National Number"
          value={newTeacher.national_number}
          required
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, national_number: e.target.value })
          }
        />
        <button type="submit" className="btn-animate">
          Add Teacher
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <table className="teachers-table fade-in">
          <thead>
            <tr>
              <th>Teacher ID</th> {/* 👈 new column */}
              <th>Name</th>
              <th>Email</th>
              <th>National Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="row-animate">
                <td>{teacher.id}</td> {/* 👈 display teacher_id */}
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
