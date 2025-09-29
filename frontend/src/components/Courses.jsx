// frontend/pages/Courses.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { Helmet } from "react-helmet-async";
import PlusIcoLight from "../assets/Icons/Light/Plus_Icon_Light.svg";
import PlusIcoDark from "../assets/Icons/Dark/Plus_Icon_Dark.svg";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [tags, setTags] = useState([]);
  const [user, setUser] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Filtering / sorting state
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortOption, setSortOption] = useState("popular");
  const [priceRange, setPriceRange] = useState(1000);

  // Course creation
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch user + data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: userData } = await api.get("/users/user");
        setUser(userData);
        setIsTeacher(userData.role === "teacher");

        // Get all tags
        const { data: tagsData } = await api.get("/courses/tags");
        setTags(["All", ...tagsData.map((t) => t.name)]);

        // Get courses
        const { data: coursesData } = await api.get("/courses/all");
        setCourses(coursesData);
      } catch (err) {
        console.error("Failed to fetch:", err);
      }
    };
    fetchData();
  }, []);

  // Filter, sort, and price control
  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    if (selectedTag !== "All") {
      filtered = filtered.filter((c) =>
        c.tags?.toLowerCase().includes(selectedTag.toLowerCase())
      );
    }

    filtered = filtered.filter((c) => Number(c.price) <= priceRange);

    switch (sortOption) {
      case "priceLow":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "latest":
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      default:
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
    }

    return filtered;
  }, [courses, selectedTag, sortOption, priceRange]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const body = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        teacher_id: user.id,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
      };

      await api.post("/courses/create", body);

      setSuccessMsg("Course created successfully!");
      setFormData({ name: "", description: "", price: "", tags: "" });

      const { data: newCourses } = await api.get(
        isTeacher ? "/courses/teacher/mycourses" : "/courses/all"
      );
      setCourses(newCourses);
      setShowForm(false);
    } catch (error) {
      console.error("Course creation failed:", error);
      setErrorMsg(error.response?.data?.error || "Internal server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Courses | 3lm Quest</title>
      </Helmet>

      <motion.div
        className="courses-page"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
      >
        <aside className="courses-sidebar">
          <h2>Filter Courses</h2>

          <div className="filter-section">
            <h3>Tags</h3>
            <ul>
              {tags.map((tag) => (
                <li
                  key={tag}
                  className={selectedTag === tag ? "active" : ""}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h3>Sort By</h3>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="latest">Latest</option>
              <option value="priceLow">Price: Low → High</option>
              <option value="priceHigh">Price: High → Low</option>
            </select>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
            <p>Up to ${priceRange}</p>
          </div>
        </aside>

        <main className="courses-content">
          <h1 className="page-title">Available Courses</h1>

          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div
                key="grid"
                className="courses-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {filteredCourses.length === 0 ? (
                  <p className="empty-msg">No courses found.</p>
                ) : (
                  filteredCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      className="course-card"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <div className="course-thumb">
                        <img
                          src={`https://picsum.photos/seed/${course.id}/400/250`}
                          alt={course.name}
                        />
                      </div>
                      <div className="course-info">
                        <h3>{course.name}</h3>
                        <p>{course.description}</p>
                        <div className="course-meta">
                          <span>${course.price}</span>
                          <small>
                            {course.tags
                              ? course.tags.toString().replace(/,/g, ", ")
                              : "No tags"}
                          </small>
                        </div>
                        <button className="enroll-btn">Enroll</button>
                      </div>
                    </motion.div>
                  ))
                )}

                {isTeacher && (
                  <motion.div
                    className="course-card add-card"
                    onClick={() => setShowForm(true)}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div className="add-content">
                      <img
                        src={PlusIcoLight}
                        alt="Add Course"
                        className="light-only"
                      />
                      <img
                        src={PlusIcoDark}
                        alt="Add Course"
                        className="dark-only"
                      />
                      <p>Add New Course</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="form"
                className="course-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2>Create Course</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Course Name"
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    placeholder="Description"
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    placeholder="Price"
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    placeholder="Comma-separated tags"
                    onChange={handleChange}
                  />

                  <div className="form-actions">
                    <button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Course"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="cancel-btn"
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
        </main>
      </motion.div>
    </>
  );
};

export default Courses;
