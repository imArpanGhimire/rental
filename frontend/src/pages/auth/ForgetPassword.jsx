import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout.jsx";
import AuthField from "../../components/ui/AuthField.jsx";
import Button from "../../components/ui/Button.jsx";

import NewPasswordFields from "../../features/auth/components/NewPasswordFields.jsx";
import { validateNewPassword } from "../../features/auth/utils/validatePassword.js";

import {
  getAccountSecurityQuestions,
  verifySecurityAnswers,
  resetPasswordWithToken,
} from "../../api/auth.api.js";

const STEP_EMAIL = "email";
const STEP_QUESTIONS = "questions";
const STEP_RESET = "reset";
const STEP_DONE = "done";

const SUBTITLES = {
  [STEP_EMAIL]: "Enter the email on your account.",
  [STEP_QUESTIONS]: "Answer your security questions.",
  [STEP_RESET]: "Choose a new password.",
  [STEP_DONE]: "All set.",
};

export default function ForgetPassword() {
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

    const validationError = validateNewPassword(newPassword, confirmPassword);
    if (validationError) {
      setError(validationError);
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
    <AuthLayout
      title="Reset password"
      subtitle={SUBTITLES[step]}
      topLinkLabel="Remembered it?"
      topLinkText="Back to login"
      topLinkTo="/login"
    >
      {error && (
        <p className="text-xs text-red-600 mb-4 text-center">{error}</p>
      )}

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
          <NewPasswordFields
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
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
          <p className="text-sm text-center text-ink/70">
            Your password has been reset. You can log in with your new password
            now.
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
    </AuthLayout>
  );
}
