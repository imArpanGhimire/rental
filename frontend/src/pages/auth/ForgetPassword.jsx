// src/pages/auth/ForgetPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";

export default function ForgetPassword() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(t("auth.forgotPassword.errorFields"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center sm:text-left">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          {t("auth.forgotPassword.title")}
        </h2>
        <p className="mt-1.5 text-sm text-text-muted">
          {t("auth.forgotPassword.subtitle")}
        </p>
      </div>

      {sent ? (
        <div className="flex flex-col items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
            <Mail size={20} />
          </span>
          <p className="text-sm text-text">
            {t("auth.forgotPassword.success", { email })}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Alert>{error}</Alert>

          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            label={t("auth.forgotPassword.email")}
            placeholder={t("auth.forgotPassword.emailPlaceholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            required
          />

          <Button type="submit" loading={loading} className="w-full !py-3.5">
            {loading ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submit")}
          </Button>
        </form>
      )}

      <Link
        to="/login"
        className="mt-7 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover sm:justify-start"
      >
        <ArrowLeft size={15} />
        {t("auth.forgotPassword.backToLogin")}
      </Link>
    </AuthLayout>
  );
}