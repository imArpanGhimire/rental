// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthLayout from "../../components/layout/AuthLayout";
import RoleToggle from "../../components/common/RoleToggle";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [role, setRole] = useState("renter");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError(t("auth.login.errorFields"));
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      navigate(role === "owner" ? "/owner/dashboard" : "/renter/dashboard");
    } catch {
      setError(t("auth.login.errorInvalid"));
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = t(`auth.role.${role}`);

  return (
    <AuthLayout>
      <div className="mb-8 text-center sm:text-left">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          {t("auth.login.title")}
        </h2>
        <p className="mt-1.5 text-sm text-text-muted">{t("auth.login.subtitle")}</p>
      </div>

      <RoleToggle value={role} onChange={setRole} className="mb-6" />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Alert>{error}</Alert>

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          label={t("auth.login.email")}
          placeholder={t("auth.login.emailPlaceholder")}
          value={form.email}
          onChange={handleChange}
          required
        />

        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          label={t("auth.login.password")}
          placeholder={t("auth.login.passwordPlaceholder")}
          value={form.password}
          onChange={handleChange}
          labelExtra={
            <Link
              to="/forget-password"
              className="text-xs font-semibold text-primary hover:text-primary-hover"
            >
              {t("auth.login.forgotPassword")}
            </Link>
          }
          required
        />

        <Button type="submit" loading={loading} className="w-full !py-3.5">
          {loading ? t("auth.login.submitting") : t("auth.login.submit", { role: roleLabel })}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-text-muted">
        {t("auth.login.noAccount")}{" "}
        <Link to="/register" className="font-semibold text-primary hover:text-primary-hover">
          {t("auth.login.createOne")}
        </Link>
      </p>
    </AuthLayout>
  );
}