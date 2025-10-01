import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Students = () => {
  const { t } = useTranslation();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [upgradingId, setUpgradingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    password: "",
    national_number: "",
    role: "user",
    Grade: "",
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get("/admin/students");
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error(t("Students.messages.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t("Students.messages.deleteConfirm"))) return;
    setDeletingId(id);
    try {
      await adminApi.delete(`/admin/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.success(t("Students.messages.deleteSuccess"));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
        err.response?.data?.error || t("Students.messages.deleteError")
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpgrade = async (id) => {
    if (!window.confirm(t("Students.messages.upgradeConfirm"))) return;
    setUpgradingId(id);
    try {
      await adminApi.post("/users/upgradeRole", { id, role: "admin" });
      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.success(t("Students.messages.upgradeSuccess"));
    } catch (err) {
      console.error("Upgrade error:", err);
      toast.error(
        err.response?.data?.error || t("Students.messages.upgradeError")
      );
    } finally {
      setUpgradingId(null);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await adminApi.post("/users/signup", newStudent);
      toast.success(t("Students.messages.addSuccess"));
      setNewStudent({
        name: "",
        email: "",
        password: "",
        national_number: "",
        role: "user",
        Grade: "",
      });
      fetchStudents();
    } catch (err) {
      console.error("Add error:", err);
      toast.error(err.response?.data?.error || t("Students.messages.addError"));
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="students-container">
      <h2>{t("Students.heading")}</h2>

      {/* Add Student Form */}
      <form className="add-student-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder={t("Students.placeholders.name")}
          value={newStudent.name}
          onChange={(e) =>
            setNewStudent({ ...newStudent, name: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder={t("Students.placeholders.email")}
          value={newStudent.email}
          onChange={(e) =>
            setNewStudent({ ...newStudent, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder={t("Students.placeholders.password")}
          value={newStudent.password}
          onChange={(e) =>
            setNewStudent({ ...newStudent, password: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder={t("Students.placeholders.nationalNumber")}
          value={newStudent.national_number}
          onChange={(e) =>
            setNewStudent({ ...newStudent, national_number: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder={t("Students.placeholders.grade")}
          value={newStudent.Grade}
          onChange={(e) =>
            setNewStudent({ ...newStudent, Grade: e.target.value })
          }
        />
        <button type="submit" disabled={adding}>
          {adding ? t("Students.buttons.adding") : t("Students.buttons.add")}
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: "center" }}>{t("Students.messages.loading")}</p>
      ) : students.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          {t("Students.messages.noStudents")}
        </p>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>{t("Students.table.id")}</th>
              <th>{t("Students.table.name")}</th>
              <th>{t("Students.table.email")}</th>
              <th>{t("Students.table.nationalNumber")}</th>
              <th>{t("Students.table.grade")}</th>
              <th>{t("Students.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.national_number}</td>
                <td>{student.Grade || "-"}</td>
                <td>
                  <button
                    onClick={() => handleUpgrade(student.id)}
                    disabled={upgradingId === student.id}
                    className="upgrade"
                  >
                    {upgradingId === student.id
                      ? t("Students.buttons.upgrading")
                      : t("Students.buttons.upgrade")}
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    disabled={deletingId === student.id}
                    className="delete"
                  >
                    {deletingId === student.id
                      ? t("Students.buttons.deleting")
                      : t("Students.buttons.delete")}
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
