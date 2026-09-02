import { useState } from "react";
import AuthField from "../../../components/ui/AuthField";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
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

      <AuthField
        label="Full Name"
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <AuthField
        label="Email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <AuthField
        label="Phone Number"
        type="tel"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="98XXXXXXXX"
        required
      />
      <PasswordInput
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        required
        minLength={6}
      />

      <SecurityQuestionsFields
        value={form.securityAnswers}
        onChange={handleSecurityAnswersChange}
      />

      {(formError || error) && (
        <p role="alert" className="form-error">
          {formError ||
            (typeof error === "string"
              ? error
              : "Please check your details and try again.")}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
