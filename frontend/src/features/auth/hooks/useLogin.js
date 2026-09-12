import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../AuthContext";

export function useLogin() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState(null);

  async function submit({
    email,
    password,
  }) {
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await login(
        email,
        password,
      );

      /*
       * Always return authenticated users
       * to "/".
       *
       * App.jsx decides what "/" means:
       *
       * owner  -> ForOwners.jsx
       * renter -> Home.jsx
       */
      navigate("/", {
        replace: true,
      });

      return data;
    } catch (err) {
      setError(
        err?.message ||
        "Login failed",
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