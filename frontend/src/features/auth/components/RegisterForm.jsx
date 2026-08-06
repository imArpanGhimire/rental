import { useState } from "react";
import AuthField from "../../../components/ui/AuthField";
import PasswordInput from "../../../components/ui/PasswordInput";
import Button from "../../../components/ui/Button";
import RoleToggle from "./RoleToggle";
import { useRegister } from "../hooks/useRegister";

export default function RegisterForm() {
  const { submit, isSubmitting, error } = useRegister();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "renter",
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleRoleChange(role) {
    setForm((prev) => ({ ...prev, role }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
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
      <PasswordInput
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        required
        minLength={6}
      />

      {error && (
        <p role="alert" className="form-error">
          {typeof error === "string" ? error : "Please check your details and try again."}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
