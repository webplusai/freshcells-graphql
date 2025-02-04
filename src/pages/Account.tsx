import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { USER_QUERY } from "../graphql/queries";
import { useTranslation } from "react-i18next";

const Account: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [error, setError] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const token = localStorage.getItem("token");

  const {
    data,
    loading,
    error: queryError,
  } = useQuery(USER_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setLoadingMessage("");
    },
    onError: () => {
      setError("Error loading user data. Please try again.");
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      setLoadingMessage(t("account.loadingMessage"));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  if (loading) {
    return <p>{loadingMessage}</p>;
  }

  if (queryError || error) {
    return <p className="text-red-500">{error || "Error loading user data"}</p>;
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">{t("account.title")}</h1>
      <div>
        <p>
          <strong>{t("account.firstName")}:</strong> {data?.user.firstName}
        </p>
        <p>
          <strong>{t("account.lastName")}:</strong> {data?.user.lastName}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 rounded mt-4"
      >
        {t("account.logoutButton")}
      </button>

      <div className="flex gap-3 mt-4">
        <button
          className="w-full bg-green-500 text-white py-2 rounded mt-4"
          onClick={() => handleLanguageChange("en")}
        >
          English
        </button>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-4"
          onClick={() => handleLanguageChange("de")}
        >
          Deutsch
        </button>
      </div>
    </div>
  );
};

export default Account;
