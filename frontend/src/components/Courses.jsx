import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCourses } from "../services/course";
import api from "../services/api";
import "../index.css";
import PlusIcoLight from "../assets/Icons/Light/Plus_Icon_Light.svg";
import PlusIcoDark from "../assets/Icons/Dark/Plus_Icon_Dark.svg";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    video: null,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch user & courses
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/users/user");
        setUser(data);
        setIsTeacher(data.role === "teacher");
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    const fetchAllCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (error) {
        console.error("Failed to load courses:", error);
      }
    };

    fetchUser();
    fetchAllCourses();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "video") {
      setFormData({ ...formData, video: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle submit (teacher only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("teacher_id", user.id);
      if (formData.video) {
        form.append("video", formData.video);
      }

      const { data } = await api.post("/courses/create", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg(`Course "${data.name}" created successfully!`);
      setFormData({ name: "", description: "", price: "", video: null });
      setCourses([...courses, data]);
      setShowForm(false); // collapse form after success
    } catch (error) {
      console.error("Course creation failed:", error);
      setErrorMsg(error?.error || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div id="card">
        <h1 className="page-title">📚 Explore Our Courses</h1>

        {/* AnimatePresence for switching between grid and form */}
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="courses-grid"
              className="courses-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {courses.length === 0 ? (
                <p className="empty-msg">No courses available yet.</p>
              ) : (
                courses.map((course) => (
                  <motion.div
                    key={course.id}
                    className="course-card"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 180 }}
                  >
                    <div className="course-thumbnail">
                      <img
                        src="https://via.placeholder.com/350x200.png?text=Course+Preview"
                        alt="Course thumbnail"
                      />
                    </div>
                    <div className="course-info">
                      <h3>{course.name}</h3>
                      <p className="description">{course.description}</p>
                      <div className="course-footer">
                        <span className="price">${course.price}</span>
                        <button className="enroll-btn">Enroll</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}

              {/* Teacher Add Course Button */}
              {isTeacher && (
                <motion.div
                  className="course-card add-course-card"
                  onClick={() => setShowForm(true)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 180 }}
                >
                  <div className="add-course-content">
                    {/* Light icon (light theme only) */}
                    <img
                      src={PlusIcoLight}
                      alt="Add Course"
                      className="plus-icon light-only"
                    />
                    {/* Dark icon (dark theme only) */}
                    <img
                      src={PlusIcoDark}
                      alt="Add Course"
                      className="plus-icon dark-only"
                    />
                    <p>Add New Course</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="course-form"
              className="course-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <h2>Create New Course</h2>
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
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleChange}
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Course"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    marginTop: "0.5rem",
                    background: "#e5e7eb",
                    color: "#333",
                  }}
                >
                  Cancel
                </button>
              </form>
              {errorMsg && <p className="error">{errorMsg}</p>}
              {successMsg && <p className="success">{successMsg}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Courses;
