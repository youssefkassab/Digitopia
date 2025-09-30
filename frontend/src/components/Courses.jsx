import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import PlusIcoLight from "../assets/Icons/Light/Plus_Icon_Light.svg";
import PlusIcoDark from "../assets/Icons/Dark/Plus_Icon_Dark.svg";

const Courses = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [tags, setTags] = useState([]);
  const [user, setUser] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Filtering / sorting state
  const [selectedTag, setSelectedTag] = useState(
    t("courses.sidebar.filterCourses") || "All"
  );
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
  const fetchCoursesAndTags = async (userData) => {
    try {
      const { data: tagsData } = await api.get("/courses/tags");
      setTags(["All", ...tagsData]);

      const { data: coursesData } = await api.get(
        userData?.role === "teacher"
          ? "/courses/teacher/mycourses"
          : "/courses/all"
      );
      setCourses(coursesData);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const { data: userData } = await api.get("/users/user");
        setUser(userData);
        setIsTeacher(userData.role === "teacher");
        await fetchCoursesAndTags(userData);
      } catch (err) {
        console.error("Failed to initialize:", err);
      }
    };
    init();
  }, []);

  // Filter, sort, and price control
  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    if (selectedTag !== "All") {
      filtered = filtered.filter((c) =>
        Array.isArray(c.tags)
          ? c.tags.some((t) =>
              (t.name || t)
                .toString()
                .toLowerCase()
                .includes(selectedTag.toLowerCase())
            )
          : c.tags?.toLowerCase().includes(selectedTag.toLowerCase())
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
        tags: formData.tags || [],
      };

      await api.post("/courses/create", body);

      setSuccessMsg(t("courses.content.messages.courseCreated"));
      setFormData({ name: "", description: "", price: "", tags: "" });
      await fetchCoursesAndTags(user);
      setShowForm(false);
    } catch (error) {
      console.error("Course creation failed:", error);
      setErrorMsg(
        error.response?.data?.error ||
          t("courses.content.messages.errorGeneric")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("courses.pageTitle")}</title>
      </Helmet>

      <motion.div
        className="courses-page"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
      >
        <aside className="courses-sidebar">
          <h2>{t("courses.sidebar.filterCourses")}</h2>

          <div className="filter-section">
            <h3>{t("courses.sidebar.tags")}</h3>
            <ul>
              {tags.map((tag) => {
                if (tag === "All") {
                  return (
                    <li
                      key="All"
                      className={selectedTag === "All" ? "active" : ""}
                      onClick={() => setSelectedTag("All")}
                    >
                      All
                    </li>
                  );
                }

                return (
                  <li
                    key={tag.id || tag}
                    className={selectedTag === tag.name ? "active" : ""}
                    onClick={() => setSelectedTag(tag.name || tag)}
                  >
                    {tag.name || tag}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="filter-section">
            <h3>{t("courses.sidebar.sortBy")}</h3>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="popular">
                {t("courses.sidebar.sortOptions.popular")}
              </option>
              <option value="latest">
                {t("courses.sidebar.sortOptions.latest")}
              </option>
              <option value="priceLow">
                {t("courses.sidebar.sortOptions.priceLow")}
              </option>
              <option value="priceHigh">
                {t("courses.sidebar.sortOptions.priceHigh")}
              </option>
            </select>
          </div>

          <div className="filter-section">
            <h3>{t("courses.sidebar.priceRange")}</h3>
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
            <motion.p
              key={priceRange}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {t("courses.sidebar.upTo", { price: priceRange })}
            </motion.p>
          </div>
        </aside>

        <main className="courses-content">
          <h1 className="page-title">
            {t("courses.content.availableCourses")}
          </h1>

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
                <AnimatePresence>
                  {filteredCourses.length === 0 ? (
                    <motion.p
                      className="empty-msg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {t("courses.content.noCoursesFound")}
                    </motion.p>
                  ) : (
                    filteredCourses.map((course) => (
                      <motion.div
                        key={course.id}
                        className="course-card"
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
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
                              {Array.isArray(course.tags)
                                ? course.tags.map((t) => t.name || t).join(", ")
                                : course.tags ||
                                  t("courses.content.courseCard.noTags")}
                            </small>
                          </div>
                          <button className="enroll-btn">
                            {t("courses.content.courseCard.enroll")}
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>

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
                        alt={t("courses.content.createCourse")}
                        className="light-only"
                      />
                      <img
                        src={PlusIcoDark}
                        alt={t("courses.content.createCourse")}
                        className="dark-only"
                      />
                      <p>{t("courses.content.createCourse")}</p>
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
                <h2>{t("courses.content.createCourse")}</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder={t("courses.content.form.name")}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    placeholder={t("courses.content.form.description")}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    placeholder={t("courses.content.form.price")}
                    onChange={handleChange}
                    required
                  />
                  <select
                    name="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: [Number(e.target.value)],
                      })
                    }
                    required
                  >
                    <option value="">
                      {t("courses.content.form.selectTag")}
                    </option>
                    {tags
                      .filter((t) => t !== "All")
                      .map((tagObj) => (
                        <option
                          key={tagObj.id || tagObj}
                          value={tagObj.id || tagObj}
                        >
                          {tagObj.name || tagObj}
                        </option>
                      ))}
                  </select>

                  <div className="form-actions">
                    <button type="submit" disabled={loading}>
                      {loading
                        ? t("courses.content.form.creating")
                        : t("courses.content.form.submit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="cancel-btn"
                    >
                      {t("courses.content.form.cancel")}
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
