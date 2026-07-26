// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import RoleToggle from "../../components/common/RoleToggle";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("renter");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError(t("auth.register.errorFields"));
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password || !form.confirm) {
      setError(t("auth.register.errorFields"));
      return;
    }
    if (form.password !== form.confirm) {
      setError(t("auth.register.errorMismatch"));
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      navigate(role === "owner" ? "/owner/dashboard" : "/renter/browse");
    } catch {
      setError(t("auth.register.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const stepDesc = t(`auth.register.step${step}Desc`);

  return (
    <AuthLayout activeStep={step}>
      <div className="mb-8 text-center sm:text-left">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          {t("auth.register.title")}
        </h2>
        <p className="mt-1.5 text-sm text-text-muted">
          {t("auth.register.stepLabel", { step, stepDesc })}
        </p>
      </div>

      {step === 1 && <RoleToggle value={role} onChange={setRole} className="mb-6" />}

      {step === 1 ? (
        <form onSubmit={handleStep1} noValidate className="space-y-4">
          <Alert>{error}</Alert>

          <Input
            id="name"
            name="name"
            type="text"
            label={t("auth.register.fullName")}
            placeholder={t("auth.register.fullNamePlaceholder")}
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            label={t("auth.register.email")}
            placeholder={t("auth.register.emailPlaceholder")}
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            id="phone"
            name="phone"
            type="tel"
            label={t("auth.register.phone")}
            placeholder={t("auth.register.phonePlaceholder")}
            value={form.phone}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="w-full !py-3.5">
            {t("auth.register.continue")}
            <ArrowRight size={16} />
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Alert>{error}</Alert>

          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            label={t("auth.register.password")}
            placeholder={t("auth.register.passwordPlaceholder")}
            value={form.password}
            onChange={handleChange}
            required
          />
          <Input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            label={t("auth.register.confirmPassword")}
            placeholder={t("auth.register.confirmPasswordPlaceholder")}
            value={form.confirm}
            onChange={handleChange}
            required
          />

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setStep(1);
                setError("");
              }}
            >
              <ArrowLeft size={16} />
              {t("auth.register.back")}
            </Button>
            <Button type="submit" loading={loading} className="flex-1 !py-3.5">
              {loading ? t("auth.register.submitting") : t("auth.register.submit")}
            </Button>
          </div>
        </form>
      )}

      <p className="mt-7 text-center text-sm text-text-muted">
        {t("auth.register.haveAccount")}{" "}
        <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">
          {t("auth.register.signIn")}
        </Link>
      </p>
    </AuthLayout>
  );
}