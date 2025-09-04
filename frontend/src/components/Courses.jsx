import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchCourses, createCourse } from "../services/course";
import api from "../services/api";
import "../index.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    video: null,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Get logged-in user role
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

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "video") {
      setFormData({ ...formData, video: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit new course (teacher only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Create a FormData object for file upload
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("teacher_id", user.id);
      if (formData.video) {
        form.append("video", formData.video);
      }

      // Override headers for multipart/form-data
      const { data } = await api.post("/courses/create", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg(`Course "${data.name}" created successfully!`);
      setFormData({ name: "", description: "", price: "", video: null });
      setCourses([...courses, data]); // Add new course to list
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
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div id="card">
        <h1>Available Courses</h1>
        {courses.length === 0 ? (
          <p>No courses available yet.</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <h3>{course.name}</h3>
                <p className="description">{course.description}</p>
                <p className="price">${course.price}</p>
                <button className="enroll-btn">Enroll</button>
              </div>
            ))}
          </div>
        )}

        {isTeacher && (
          <div className="course-form">
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
            </form>
            {errorMsg && <p className="error">{errorMsg}</p>}
            {successMsg && <p className="success">{successMsg}</p>}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Courses;
