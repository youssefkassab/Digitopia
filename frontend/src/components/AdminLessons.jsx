import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import FloatingIcons from "./FloatingIcons";
import "./AdminLessons.css"; // Import the CSS file

const AdminLessons = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    teacher_id: "",
  });

  // ✅ Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/courses/all");
      const data = await res.json();
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Delete course
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await fetch("http://localhost:3000/api/courses/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✅ Start editing
  const handleEdit = (course) => {
    setEditingCourse(course.id);
    setFormData({
      id: course.id,
      name: course.name,
      description: course.description,
      price: course.price,
      teacher_id: course.teacher_id,
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
      await fetch("http://localhost:3000/api/courses/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setCourses(
        courses.map((c) =>
          c.id === formData.id ? { ...c, ...formData } : c
        )
      );
      setEditingCourse(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="admin-lessons-container">
      <FloatingIcons />
      <AdminNavbar />

      <div className="admin-lessons-content">
        <h1 className="page-title">Courses Management</h1>

        {loading ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Teacher ID</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>

                  {/* Editable fields */}
                  <td>
                    {editingCourse === course.id ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-edit"
                      />
                    ) : (
                      course.name
                    )}
                  </td>
                  <td>
                    {editingCourse === course.id ? (
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input-edit"
                      />
                    ) : (
                      course.description
                    )}
                  </td>
                  <td>
                    {editingCourse === course.id ? (
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="input-edit"
                      />
                    ) : (
                      `$${course.price}`
                    )}
                  </td>
                  <td>
                    {editingCourse === course.id ? (
                      <input
                        type="number"
                        name="teacher_id"
                        value={formData.teacher_id}
                        onChange={handleChange}
                        className="input-edit"
                      />
                    ) : (
                      course.teacher_id
                    )}
                  </td>

                  <td>{new Date(course.created_at).toLocaleDateString()}</td>
                  <td>{new Date(course.updated_at).toLocaleDateString()}</td>

                  {/* Actions */}
                  <td className="actions">
                    {editingCourse === course.id ? (
                      <button onClick={handleUpdate} className="btn save">
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(course)}
                        className="btn edit"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(course.id)}
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

export default AdminLessons;
