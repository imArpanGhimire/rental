import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../AuthContext";

export function useRegister() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState(null);

  async function submit(payload) {
    setIsSubmitting(true);
    setError(null);

    try {
      const data =
        await register(payload);

      /*
       * Registration does not create
       * an authenticated session.
       *
       * User registers
       * -> login
       * -> successful login
       * -> "/"
       * -> App.jsx shows the correct
       *    role-based landing page.
       */
      navigate("/login", {
        replace: true,
      });

      return data;
    } catch (err) {
      setError(
        err?.errors ||
        err?.message ||
        "Registration failed",
      );

      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submit,
    isSubmitting,
    error,
  };
}