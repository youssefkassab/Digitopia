import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const CoursesManage = () => {
  const { t } = useTranslation();

  const [courses, setCourses] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    teacher_id: "",
    tags: [],
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const normalizeCourseFromApi = (raw) => {
    const normalized = { ...raw };
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
      setCourses(Array.isArray(data) ? data.map(normalizeCourseFromApi) : []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setErrorMsg(t("CoursesManage.messages.errorLoad"));
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
    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) =>
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
      (formData.teacher_id === "" && !editingCourse) ||
      !Array.isArray(formData.tags) ||
      formData.tags.length === 0
    ) {
      setErrorMsg(t("CoursesManage.messages.errorRequiredFields"));
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
        setSuccessMsg(t("CoursesManage.messages.successUpdate"));
      } else {
        await adminApi.post("/courses/create", payload);
        setSuccessMsg(t("CoursesManage.messages.successCreate"));
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
          t("CoursesManage.messages.errorOperationFailed")
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("CoursesManage.messages.errorOperationFailed")))
      return;

    try {
      await adminApi.delete("/courses/delete", { data: { id } });
      setSuccessMsg(t("CoursesManage.messages.successDelete"));
      fetchCourses();
    } catch (err) {
      console.error("Delete error:", err);
      if (err?.response?.status === 404) {
        setErrorMsg(t("CoursesManage.messages.errorDeleteNotFound"));
      } else if (err?.response?.status === 400) {
        setErrorMsg(t("CoursesManage.messages.errorDeleteInvalid"));
      } else {
        setErrorMsg(t("CoursesManage.messages.errorDeleteFailed"));
      }
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    const tagsForForm =
      Array.isArray(course.tags) && course.tags.length > 0
        ? course.tags.map((t) => {
            if (t && typeof t === "object") return t.id ?? t.name;
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

  const adminToken = localStorage.getItem("adminToken");

  return (
    <>
      <Helmet>
        <title>{t("CoursesManage.pageTitle")}</title>
      </Helmet>

      <motion.div
        className="courses-container fade-in"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2>{t("CoursesManage.heading")}</h2>

        {!adminToken && (
          <p className="warning">{t("CoursesManage.warnings.noToken")}</p>
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
          {t("CoursesManage.buttons.addCourse")}
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
              <h3>
                {editingCourse
                  ? t("CoursesManage.formHeading.edit")
                  : t("CoursesManage.formHeading.add")}
              </h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder={t("CoursesManage.form.courseName")}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder={t("CoursesManage.form.courseDescription")}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  placeholder={t("CoursesManage.form.price")}
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="teacher_id"
                  placeholder={t("CoursesManage.form.teacherId")}
                  value={formData.teacher_id}
                  onChange={handleChange}
                  required={!editingCourse}
                />
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
                    {editingCourse
                      ? t("CoursesManage.buttons.update")
                      : t("CoursesManage.buttons.create")}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    {t("CoursesManage.buttons.cancel")}
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
            <p>{t("CoursesManage.messages.loadingCourses")}</p>
          ) : (
            <table className="courses-table">
              <thead>
                <tr>
                  <th>{t("CoursesManage.table.id")}</th>
                  <th>{t("CoursesManage.table.name")}</th>
                  <th>{t("CoursesManage.table.description")}</th>
                  <th>{t("CoursesManage.table.price")}</th>
                  <th>{t("CoursesManage.table.teacherId")}</th>
                  <th>{t("CoursesManage.table.tags")}</th>
                  <th>{t("CoursesManage.table.actions")}</th>
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
                        {t("CoursesManage.buttons.edit")}
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(course.id)}
                      >
                        {t("CoursesManage.buttons.delete")}
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
