import { useState } from "react";
import { ArrowRight } from "lucide-react";

import AuthField from "../../../components/ui/AuthField";
import PasswordInput from "../../../components/ui/PasswordInput";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const { submit, isSubmitting, error } = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await submit(form);
    } catch {
      // error state is already handled by useLogin
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <AuthField
        label="Email address"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="you@example.com"
        autoComplete="email"
        required
      />

      <PasswordInput
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="••••••••"
        autoComplete="current-password"
        required
      />

      {error && (
        <div
          role="alert"
          className="rounded-[14px] border border-rose-400/15 bg-rose-400/[0.08] px-3.5 py-3 text-[11px] leading-5 text-rose-300"
        >
          {typeof error === "string"
            ? error
            : "Please check your details and try again."}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          mt-1 flex h-12 w-full items-center justify-center gap-2
          rounded-[14px] border border-white bg-white
          px-4 text-[13px] font-semibold text-[#15171b]
          shadow-[0_12px_34px_rgba(0,0,0,0.16)]
          transition-colors hover:bg-white/90
          disabled:cursor-not-allowed disabled:opacity-55
        "
      >
        <span>{isSubmitting ? "Logging in..." : "Log in"}</span>
        {!isSubmitting && <ArrowRight size={14} strokeWidth={2} />}
      </button>
    </form>
  );
}
