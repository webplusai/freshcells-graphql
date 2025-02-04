import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LOGIN_MUTATION } from "../graphql/mutations";
import { useTranslation } from "react-i18next";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();

  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      setSuccessMessage(t("login.successMessage"));
      localStorage.setItem("token", data.login.jwt);
      setTimeout(() => {
        navigate("/account");
      }, 1500);
    },
    onError: (err) => {
      console.error("Mutation Error:", err);
      setError(t("login.error"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !password) {
      setError(t("login.error"));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t("login.error"));
      return;
    }

    setLoading(true);

    login({
      variables: { identifier: email, password },
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">{t("login.title")}</h1>

      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full px-4 py-2 border rounded"
          placeholder={t("login.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          className="w-full px-4 py-2 border rounded"
          placeholder={t("login.passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {loading ? (
          <div className="flex justify-center py-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
            disabled={loading}
          >
            {t("login.submitButton")}
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
