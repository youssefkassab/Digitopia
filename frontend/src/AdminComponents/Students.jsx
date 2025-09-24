import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import {
  getStoredAdmin,
  isAdminAuthenticated,
  adminLogout,
} from "../AdminServices/adminAuth";

const tempMailDomains = [
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "dispostable.com",
  "yopmail.com",
];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    password: "",
    national_number: "",
    Grade: "",
  });

  // Redirect if admin not logged in
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
    const parts = email.split("@");
    const domain = parts[1].toLowerCase();
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

  const validateGrade = (grade) => {
    const num = parseInt(grade, 10);
    if (
      (!isNaN(num) && num >= 1 && num <= 12) ||
      (/(college|year|grade)/i.test(grade) && /\d/.test(grade))
    ) {
      return true;
    }
    setError("Grade must be between 1 and 12 or a valid college/year format.");
    return false;
  };

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get("/admin/students");
      setStudents(data);
      setError("");
    } catch (err) {
      // If unauthorized, log out
      if (err.response?.status === 401) {
        await adminLogout();
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

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !validateName(newStudent.name) ||
      !validateEmail(newStudent.email) ||
      !validatePassword(newStudent.password) ||
      !validateNationalId(newStudent.national_number) ||
      !validateGrade(newStudent.Grade)
    ) {
      return;
    }

    try {
      await adminApi.post("/admin/students", newStudent);
      setNewStudent({
        name: "",
        email: "",
        password: "",
        national_number: "",
        Grade: "",
      });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add student.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await adminApi.delete(`/admin/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete student.");
    }
  };

  return (
    <div className="students-container">
      <h2>Manage Students</h2>

      <form className="add-student-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Name"
          value={newStudent.name}
          required
          onChange={(e) =>
            setNewStudent({ ...newStudent, name: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          value={newStudent.email}
          required
          onChange={(e) =>
            setNewStudent({ ...newStudent, email: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={newStudent.password}
          required
          onChange={(e) =>
            setNewStudent({ ...newStudent, password: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="National Number"
          value={newStudent.national_number}
          required
          onChange={(e) =>
            setNewStudent({ ...newStudent, national_number: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Grade"
          value={newStudent.Grade}
          required
          onChange={(e) =>
            setNewStudent({ ...newStudent, Grade: e.target.value })
          }
        />
        <button type="submit">Add Student</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
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
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.national_number}</td>
                <td>{student.Grade}</td>
                <td>
                  <button
                    className="delete"
                    onClick={() => handleDelete(student.id)}
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

export default Students;
