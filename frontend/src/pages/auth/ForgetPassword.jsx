import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout.jsx";
import AuthField from "../../components/ui/AuthField.jsx";
import { forgotPasswordRequest } from "../../api/auth.api.js";

export default function ForgetPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async ({ email }) => {
    setSubmitting(true);
    try {
      await forgotPasswordRequest(email);
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email tied to your account and we'll send a reset link."
      topLinkLabel="Remembered it?"
      topLinkText="Log in"
      topLinkTo="/login"
    >
      {sent ? (
        <p className="text-sm text-ink/70 text-center">
          Check your email for a reset link.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <AuthField
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register("email", { required: "Email is required" })}
            error={errors.email?.message}
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 flex items-center justify-center gap-2 bg-brass text-white rounded-xl py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send Reset Link"}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
