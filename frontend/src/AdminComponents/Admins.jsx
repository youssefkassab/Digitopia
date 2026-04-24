import React, { useEffect, useState } from "react";
import adminApi from "../AdminServices/adminApi";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Admins = () => {
  const { t } = useTranslation();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get("/admin/admins");

      if (Array.isArray(data)) {
        setAdmins(data);
      } else if (data && data.id && data.email) {
        setAdmins([data]);
      } else {
        setAdmins([]);
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      toast.error(err.response?.data?.error || t("Admins.messages.fetchError"));
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="admins-container">
      <h2>{t("Admins.heading")}</h2>

      {loading ? (
        <p className="loading-text">{t("Admins.messages.loading")}</p>
      ) : admins.length === 0 ? (
        <p className="no-data-text">{t("Admins.messages.noAdmins")}</p>
      ) : (
        <table className="admins-table">
          <thead>
            <tr>
              <th>{t("Admins.table.email")}</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="row-animate">
                <td>{admin.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admins;
