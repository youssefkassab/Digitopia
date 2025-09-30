import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

const CoursesManage = () => {
  const [courses, setCourses] = useState([]);
  const [tags, setTags] = useState([]); // tags from backend
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    teacher_id: "",
    tags: [], // array of selected tag IDs
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Convert API tag representation to consistent format
  const normalizeCourseFromApi = (raw) => {
    const normalized = { ...raw };
    // Some endpoints return tags as comma-separated string, some return array.
    if (typeof raw.tags === "string") {
      const str = raw.tags.trim();
      normalized.tags =
        str.length > 0 ? str.split(",").map((t) => t.trim()) : [];
    } else if (Array.isArray(raw.tags)) {
      normalized.tags = raw.tags;
    } else {
      normalized.tags = [];
    }
    return normalized;
  };

  const fetchCourses = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data } = await adminApi.get("/courses/all");
      // Normalize each course so front-end can reliably expect tags to be either array of names or ids
      setCourses(Array.isArray(data) ? data.map(normalizeCourseFromApi) : []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setErrorMsg("Failed to load courses. Check server and auth token.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const { data } = await adminApi.get("/courses/tags");
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
      // not fatal — allow manual tag creation elsewhere
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e) => {
    // multiple select: collect selected values
    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) =>
      // tags likely use numeric ids; store as number when possible
      String(opt.value).match(/^\d+$/) ? parseInt(opt.value, 10) : opt.value
    );
    setFormData((prev) => ({ ...prev, tags: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (
      !formData.name ||
      !formData.description ||
      formData.price === "" ||
      (formData.teacher_id === "" && !editingCourse) || // teacher_id optional for editing if backend allows
      !Array.isArray(formData.tags) ||
      formData.tags.length === 0
    ) {
      setErrorMsg(
        "All fields (name, description, price, teacher ID when creating, and at least one tag) are required."
      );
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        teacher_id:
          formData.teacher_id === "" ? undefined : Number(formData.teacher_id),
        tags: formData.tags,
      };

      if (editingCourse) {
        await adminApi.put("/courses/update", {
          id: editingCourse.id,
          ...payload,
        });
        setSuccessMsg("Course updated successfully!");
      } else {
        await adminApi.post("/courses/create", payload);
        setSuccessMsg("Course created successfully!");
      }

      setFormData({
        name: "",
        description: "",
        price: "",
        teacher_id: "",
        tags: [],
      });
      setEditingCourse(null);
      setShowForm(false);
      await fetchCourses();
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Operation failed."
      );
    }
  };

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      // ✅ Use POST instead of DELETE to align with backend expectation
      await adminApi.post("/courses/delete", { id });
      setSuccessMsg("Course deleted successfully!");
      fetchCourses(); // refresh list
    } catch (err) {
      console.error("Delete error:", err);
      if (err?.response?.status === 404) {
        setErrorMsg("Course not found or already deleted.");
      } else if (err?.response?.status === 400) {
        setErrorMsg("Invalid course ID or request format.");
      } else {
        setErrorMsg("Delete failed. Please try again.");
      }
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    const tagsForForm =
      Array.isArray(course.tags) && course.tags.length > 0
        ? course.tags.map((t) => {
            // If tag items are objects ( {id, name} ), use id; if names, keep them.
            if (t && typeof t === "object") return t.id ?? t.name;
            // if value looks numeric string, convert to number
            return String(t).match(/^\d+$/) ? parseInt(t, 10) : t;
          })
        : [];

    setFormData({
      name: course.name ?? "",
      description: course.description ?? "",
      price: course.price ?? "",
      teacher_id: course.teacher_id ?? "",
      tags: tagsForForm,
    });
    setShowForm(true);
  };

  // quick token check (helpful if 404 was due to missing auth)
  const adminToken = localStorage.getItem("adminToken");

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

        {!adminToken && (
          <p className="warning">
            No admin token found in localStorage. Authentication may fail for
            create/update/delete actions.
          </p>
        )}

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
              tags: [],
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
                  step="0.01"
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
                  // when editing, teacher_id may be optional — keep not required
                  required={!editingCourse}
                />
                {/* multiple select: no dummy disabled option when multiple */}
                <select
                  name="tags"
                  multiple
                  value={formData.tags}
                  onChange={handleTagChange}
                  required
                  size={Math.min(6, Math.max(3, tags.length))}
                >
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>

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
                  <th>Tags</th>
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
                    <td>
                      {typeof course.price === "number"
                        ? `$${Number(course.price).toFixed(2)}`
                        : course.price}
                    </td>
                    <td>{course.teacher_id ?? "-"}</td>
                    <td>
                      {Array.isArray(course.tags) && course.tags.length > 0
                        ? course.tags
                            .map((t) =>
                              typeof t === "object"
                                ? t.name ?? String(t.id)
                                : String(t)
                            )
                            .join(", ")
                        : "-"}
                    </td>
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
