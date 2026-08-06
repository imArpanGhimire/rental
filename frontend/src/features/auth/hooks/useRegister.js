import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export function useRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // payload: { name, email, password, role: 'owner' | 'renter' }
  async function submit(payload) {
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await register(payload);
      // Backend register route doesn't log the user in automatically per the README
      // (separate /login endpoint) — send them to login after successful signup.
      navigate("/login");
      return data;
    } catch (err) {
      setError(err.message || "Registration failed");
      if (err.errors) setError(err.errors);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, error };
}
