import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthField from "../../components/ui/AuthField.jsx";
import PasswordInput from "../../components/ui/PasswordInput.jsx";
import Button from "../../components/ui/Button.jsx";

import {
  getAccountSecurityQuestions,
  verifySecurityAnswers,
  resetPasswordWithToken,
} from "../../api/auth.api.js";

const STEP_EMAIL = "email";
const STEP_QUESTIONS = "questions";
const STEP_RESET = "reset";
const STEP_DONE = "done";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(["", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await getAccountSecurityQuestions(
        email.trim().toLowerCase(),
      );
      setQuestions(data.questions);
      setAnswers(["", ""]);
      setStep(STEP_QUESTIONS);
    } catch (err) {
      setError(err.message || "Couldn't find an account with that email.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAnswersSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        answers: questions.map((question, i) => ({
          question,
          answer: answers[i],
        })),
      };

      const data = await verifySecurityAnswers(payload);
      setResetToken(data.resetToken);
      setStep(STEP_RESET);
    } catch (err) {
      setError(err.message || "Those answers don't match our records.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetSubmit(e) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPasswordWithToken({ resetToken, newPassword });
      setStep(STEP_DONE);
    } catch (err) {
      setError(
        err.message || "Couldn't reset your password. Please start again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-sm border border-stone rounded-2xl p-6 sm:p-8">
        <h1 className="font-display text-2xl text-text mb-1">
          Reset your password
        </h1>
        <p className="text-sm text-text/50 mb-6">
          {step === STEP_EMAIL && "Enter the email on your account."}
          {step === STEP_QUESTIONS && "Answer your security questions."}
          {step === STEP_RESET && "Choose a new password."}
          {step === STEP_DONE && "All set."}
        </p>

        {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

        {step === STEP_EMAIL && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <AuthField
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              pill
              disabled={isLoading}
              className="!py-2.5 text-xs"
            >
              {isLoading ? "Checking..." : "Continue"}
            </Button>
          </form>
        )}

        {step === STEP_QUESTIONS && (
          <form onSubmit={handleAnswersSubmit} className="flex flex-col gap-4">
            {questions.map((question, i) => (
              <AuthField
                key={question}
                label={question}
                name={`answer-${i}`}
                value={answers[i]}
                onChange={(e) => {
                  const next = [...answers];
                  next[i] = e.target.value;
                  setAnswers(next);
                }}
                required
              />
            ))}

            <Button
              type="submit"
              pill
              disabled={isLoading}
              className="!py-2.5 text-xs"
            >
              {isLoading ? "Checking..." : "Continue"}
            </Button>
          </form>
        )}

        {step === STEP_RESET && (
          <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
            <PasswordInput
              label="New password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />

            <PasswordInput
              label="Confirm new password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />

            <Button
              type="submit"
              pill
              disabled={isLoading}
              className="!py-2.5 text-xs"
            >
              {isLoading ? "Resetting..." : "Reset password"}
            </Button>
          </form>
        )}

        {step === STEP_DONE && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text/70">
              Your password has been reset. You can log in with your new
              password now.
            </p>

            <Button
              pill
              onClick={() => navigate("/login")}
              className="!py-2.5 text-xs"
            >
              Go to login
            </Button>
          </div>
        )}

        {step !== STEP_DONE && (
          <p className="text-xs text-text/50 mt-6 text-center">
            <Link
              to="/login"
              className="font-medium text-brass hover:underline"
            >
              Back to login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
