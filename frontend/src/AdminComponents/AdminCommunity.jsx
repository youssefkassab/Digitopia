import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const AdminCommunity = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("AdminCommunity.pageTitle")}</title>
      </Helmet>
      <motion.div
        className="page-container"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="card">
          <h1>{t("AdminCommunity.comingSoon")}</h1>
        </div>
      </motion.div>
    </>
  );
};

export default AdminCommunity;
