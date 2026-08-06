import { useState } from "react";
import AuthField from "../../../components/ui/AuthField";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
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
      // error state is already set inside useLogin; nothing else to do here
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <AuthField
        label="Email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="you@example.com"
        required
      />
      <PasswordInput
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="••••••••"
        required
      />

      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
          {typeof error === "string" ? error : "Please check your details and try again."}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
        {isSubmitting ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
}
