import { useState } from "react";
import { ArrowRight } from "lucide-react";

import AuthField from "../../../components/ui/AuthField";
import PasswordInput from "../../../components/ui/PasswordInput";
import RoleToggle from "./RoleToggle";
import SecurityQuestionsFields from "./SecurityQuestionsFields";
import { useRegister } from "../hooks/useRegister";

export default function RegisterForm() {
  const { submit, isSubmitting, error } = useRegister();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "renter",
    securityAnswers: [
      { question: "", answer: "" },
      { question: "", answer: "" },
    ],
  });

  const [formError, setFormError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleRoleChange(role) {
    setForm((prev) => ({ ...prev, role }));
  }

  function handleSecurityAnswersChange(securityAnswers) {
    setForm((prev) => ({ ...prev, securityAnswers }));
  }

  function validate() {
    const [q1, q2] = form.securityAnswers;

    if (!q1.question || !q2.question) {
      return "Please select both security questions.";
    }

    if (q1.question === q2.question) {
      return "Please choose two different security questions.";
    }

    if (!q1.answer.trim() || !q2.answer.trim()) {
      return "Please answer both security questions.";
    }

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");

    try {
      await submit(form);
    } catch {
      // error already captured in useRegister
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <RoleToggle value={form.role} onChange={handleRoleChange} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AuthField
          label="Full name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />

        <AuthField
          label="Phone number"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="98XXXXXXXX"
          autoComplete="tel"
          required
        />

        <div className="sm:col-span-2">
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
        </div>

        <div className="sm:col-span-2">
          <PasswordInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            required
            minLength={6}
          />
        </div>
      </div>

      <SecurityQuestionsFields
        value={form.securityAnswers}
        onChange={handleSecurityAnswersChange}
      />

      {(formError || error) && (
        <div
          role="alert"
          className="mt-4 rounded-[14px] border border-rose-400/15 bg-rose-400/[0.08] px-3.5 py-3 text-[11px] leading-5 text-rose-300"
        >
          {formError ||
            (typeof error === "string"
              ? error
              : "Please check your details and try again.")}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          mt-5 flex h-12 w-full items-center justify-center gap-2
          rounded-[14px] border border-white bg-white
          px-4 text-[13px] font-semibold text-[#15171b]
          shadow-[0_12px_34px_rgba(0,0,0,0.16)]
          transition-colors hover:bg-white/90
          disabled:cursor-not-allowed disabled:opacity-55
        "
      >
        <span>{isSubmitting ? "Creating account..." : "Create account"}</span>
        {!isSubmitting && <ArrowRight size={14} strokeWidth={2} />}
      </button>
    </form>
  );
}
