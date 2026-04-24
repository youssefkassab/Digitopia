import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Teachers = () => {
  const { t } = useTranslation();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [upgradingId, setUpgradingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    password: "",
    national_number: "",
    role: "teacher",
  });

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get("/admin/teachers");
      setTeachers(data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      toast.error(t("Teachers.messages.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t("Teachers.messages.deleteConfirm"))) return;
    setDeletingId(id);
    try {
      await adminApi.delete(`/admin/teachers/${id}`);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      toast.success(t("Teachers.messages.deleteSuccess"));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
        err.response?.data?.error || t("Teachers.messages.deleteError")
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpgrade = async (id) => {
    if (!window.confirm(t("Teachers.messages.upgradeConfirm"))) return;
    setUpgradingId(id);
    try {
      await adminApi.post("/users/upgradeRole", { id, role: "admin" });
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      toast.success(t("Teachers.messages.upgradeSuccess"));
    } catch (err) {
      console.error("Upgrade error:", err);
      toast.error(
        err.response?.data?.error || t("Teachers.messages.upgradeError")
      );
    } finally {
      setUpgradingId(null);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await adminApi.post("/users/signup", newTeacher);
      toast.success(t("Teachers.messages.addSuccess"));
      setNewTeacher({
        name: "",
        email: "",
        password: "",
        national_number: "",
        role: "teacher",
      });
      fetchTeachers();
    } catch (err) {
      console.error("Add error:", err);
      toast.error(err.response?.data?.error || t("Teachers.messages.addError"));
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="students-container">
      <h2>{t("Teachers.heading")}</h2>

      {/* Add Teacher Form */}
      <form className="add-student-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder={t("Teachers.placeholders.name")}
          value={newTeacher.name}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, name: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder={t("Teachers.placeholders.email")}
          value={newTeacher.email}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder={t("Teachers.placeholders.password")}
          value={newTeacher.password}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, password: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder={t("Teachers.placeholders.nationalNumber")}
          value={newTeacher.national_number}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, national_number: e.target.value })
          }
          required
        />
        <button type="submit" disabled={adding}>
          {adding ? t("Teachers.buttons.adding") : t("Teachers.buttons.add")}
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: "center" }}>{t("Teachers.messages.loading")}</p>
      ) : teachers.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          {t("Teachers.messages.noTeachers")}
        </p>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>{t("Teachers.table.id")}</th>
              <th>{t("Teachers.table.name")}</th>
              <th>{t("Teachers.table.email")}</th>
              <th>{t("Teachers.table.nationalNumber")}</th>
              <th>{t("Teachers.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.national_number}</td>
                <td>
                  <button
                    onClick={() => handleUpgrade(teacher.id)}
                    disabled={upgradingId === teacher.id}
                    className="upgrade"
                  >
                    {upgradingId === teacher.id
                      ? t("Teachers.buttons.upgrading")
                      : t("Teachers.buttons.upgrade")}
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    disabled={deletingId === teacher.id}
                    className="delete"
                  >
                    {deletingId === teacher.id
                      ? t("Teachers.buttons.deleting")
                      : t("Teachers.buttons.delete")}
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

export default Teachers;
