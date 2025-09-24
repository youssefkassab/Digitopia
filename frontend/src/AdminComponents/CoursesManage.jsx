import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

const CoursesManage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    teacher_id: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get("/courses/all");
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add / Update Course
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.name || !formData.description || !formData.price) {
      setErrorMsg("Name, description, and price are required.");
      return;
    }

    try {
      if (editingCourse) {
        await adminApi.put("/courses/update", {
          id: editingCourse.id,
          ...formData,
        });
        setSuccessMsg("Course updated successfully!");
      } else {
        await adminApi.post("/courses/create", formData);
        setSuccessMsg("Course created successfully!");
      }

      setFormData({ name: "", description: "", price: "", teacher_id: "" });
      setEditingCourse(null);
      setShowForm(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.response?.data?.error || "Operation failed.");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await adminApi.delete("/courses/delete", { data: { id } });
      setSuccessMsg("Course deleted successfully!");
      fetchCourses();
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.response?.data?.error || "Delete failed.");
    }
  };

  // Handle edit
  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description,
      price: course.price,
      teacher_id: course.teacher_id || "",
    });
    setShowForm(true);
  };

  return (
    <>
      <Helmet>
        <title>Admin Courses | 3lm Quest</title>
      </Helmet>
      <motion.div
        className="courses-container fade-in"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2>Manage Courses</h2>

        <button
          className="btn-add"
          onClick={() => {
            setShowForm(true);
            setEditingCourse(null);
            setFormData({
              name: "",
              description: "",
              price: "",
              teacher_id: "",
            });
          }}
        >
          Add New Course
        </button>

        <AnimatePresence>
          {showForm && (
            <motion.div
              className="add-course-form pop-in"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3>{editingCourse ? "Edit Course" : "Add Course"}</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Course Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Course Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="teacher_id"
                  placeholder="Teacher ID"
                  value={formData.teacher_id}
                  onChange={handleChange}
                />
                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    {editingCourse ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {errorMsg && <p className="error">{errorMsg}</p>}
              {successMsg && <p className="success">{successMsg}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="table-container">
          {loading ? (
            <p>Loading courses...</p>
          ) : (
            <table className="courses-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Teacher ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <motion.tr
                    key={course.id}
                    className="row-animate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <td>{course.id}</td>
                    <td>{course.name}</td>
                    <td>{course.description}</td>
                    <td>${course.price}</td>
                    <td>{course.teacher_id || "-"}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(course)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(course.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default CoursesManage;
