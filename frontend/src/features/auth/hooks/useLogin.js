import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function submit({ email, password }) {
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await login(email, password);
      const role = data.user?.role || data.role;
      navigate(role === "owner" ? "/owner" : "/renter");
      return data;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, error };
}
