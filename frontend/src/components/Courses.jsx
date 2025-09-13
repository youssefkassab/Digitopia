import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCourses } from "../services/course";
import api from "../services/api";
import "../index.css";
import PlusIcoLight from "../assets/Icons/Light/Plus_Icon_Light.svg";
import PlusIcoDark from "../assets/Icons/Dark/Plus_Icon_Dark.svg";
import { Helmet } from "react-helmet-async";

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

  // Sidebar filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("popular");
  const [priceRange, setPriceRange] = useState(500);

  // Categories list
  const categories = [
    "All",
    "Programming",
    "Design",
    "Marketing",
    "Business",
    "Languages",
  ];

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
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        teacher_id: user.id,
        category: "Programming", // default, you can later allow teachers to select category
        popularity: Math.floor(Math.random() * 1000), // mock popularity
        createdAt: new Date().toISOString(),
      };

      await api.post("/courses/create", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccessMsg(`Course "${payload.name}" created successfully!`);
      setFormData({ name: "", description: "", price: "", video: null });
      setCourses([...courses, payload]);
      setShowForm(false);
    } catch (error) {
      console.error("Course creation failed:", error);
      setErrorMsg(error?.response?.data?.error || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters, sorting, and price range
  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    // Filter by category (ignore if "All")
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (c) => c.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by price range
    filtered = filtered.filter((c) => Number(c.price) <= priceRange);

    // Sorting
    switch (sortOption) {
      case "latest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "priceLow":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
      default:
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
    }

    return filtered;
  }, [courses, selectedCategory, priceRange, sortOption]);

  return (
    <>
      <Helmet>
        <title>Courses | 3lm Quest</title>
      </Helmet>
      <motion.div
        className="page-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="courses-layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <h2>Filters</h2>

            <div className="filter-section">
              <h3>Categories</h3>
              <ul>
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={selectedCategory === cat ? "active" : ""}
                    onClick={() => setSelectedCategory(cat)}
                    style={{ cursor: "pointer" }}
                  >
                    {cat}
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
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <p>
                Showing up to: <strong>${priceRange}</strong>
              </p>
            </div>
          </aside>

          {/* Main Content */}
          <div id="card" className="courses-content">
            <h1 className="page-title">Explore Our Courses</h1>

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
                  {filteredCourses.length === 0 ? (
                    <p className="empty-msg">No courses available yet.</p>
                  ) : (
                    filteredCourses.map((course) => (
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
                        <img
                          src={PlusIcoLight}
                          alt="Add Course"
                          className="plus-icon light-only"
                        />
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
        </div>
      </motion.div>
    </>
  );
};

export default Courses;
