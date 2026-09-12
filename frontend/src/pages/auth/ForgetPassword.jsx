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
  [STEP_QUESTIONS]:
    "Select the two security questions you chose while registering and enter your answers.",
  [STEP_RESET]: "Choose a new password.",
  [STEP_DONE]: "Your password has been reset.",
};

export default function ForgetPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(STEP_EMAIL);

  const [email, setEmail] = useState("");

  // All available security questions from the backend
  const [questions, setQuestions] = useState([]);

  // The two questions the user selects
  const [selectedQuestions, setSelectedQuestions] = useState(["", ""]);

  // The two answers entered by the user
  const [answers, setAnswers] = useState(["", ""]);

  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleEmailSubmit(e) {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await getAccountSecurityQuestions(cleanEmail);

      if (!Array.isArray(data?.questions) || data.questions.length === 0) {
        setError("Security questions are unavailable.");
        return;
      }

      setQuestions(data.questions);

      setSelectedQuestions(["", ""]);
      setAnswers(["", ""]);

      setStep(STEP_QUESTIONS);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Couldn't find an account with that email.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleQuestionChange(index, value) {
    setSelectedQuestions((previous) => {
      const updated = [...previous];
      updated[index] = value;
      return updated;
    });

    // Clear the old answer if the selected question changes
    setAnswers((previous) => {
      const updated = [...previous];
      updated[index] = "";
      return updated;
    });

    setError("");
  }

  function handleAnswerChange(index, value) {
    setAnswers((previous) => {
      const updated = [...previous];
      updated[index] = value;
      return updated;
    });

    setError("");
  }

  async function handleSecurityQuestionsSubmit(e) {
    e.preventDefault();

    setError("");

    const question1 = selectedQuestions[0];
    const question2 = selectedQuestions[1];

    const answer1 = answers[0].trim();
    const answer2 = answers[1].trim();

    if (!question1 || !question2) {
      setError("Please select both security questions.");
      return;
    }

    if (question1 === question2) {
      setError("Please choose two different security questions.");
      return;
    }

    if (!answer1 || !answer2) {
      setError("Please answer both security questions.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await verifySecurityAnswers({
        email: email.trim().toLowerCase(),

        answers: [
          {
            question: question1,
            answer: answer1,
          },
          {
            question: question2,
            answer: answer2,
          },
        ],
      });

      if (!data?.resetToken) {
        setError("Unable to verify your security questions.");
        return;
      }

      setResetToken(data.resetToken);

      setStep(STEP_RESET);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "The selected questions or answers do not match our records.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPasswordSubmit(e) {
    e.preventDefault();

    setError("");

    const validationError = validateNewPassword(newPassword, confirmPassword);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!resetToken) {
      setError("Your reset session is invalid. Please start again.");
      setStep(STEP_EMAIL);
      return;
    }

    setIsLoading(true);

    try {
      await resetPasswordWithToken({
        resetToken,
        newPassword,
      });

      setStep(STEP_DONE);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Couldn't reset your password. Please start again.",
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
        <div
          className="
            mb-4
            rounded-[12px]
            border border-red-400/15
            bg-red-400/[0.06]
            px-3.5
            py-2.5
            text-xs
            leading-5
            text-red-300
          "
        >
          {error}
        </div>
      )}

      {/* STEP 1: EMAIL */}
      {step === STEP_EMAIL && (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <AuthField
            label="Email address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="you@example.com"
            autoComplete="email"
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

      {/* STEP 2: TWO QUESTION DROPDOWNS + TWO ANSWER FIELDS */}
      {step === STEP_QUESTIONS && (
        <form
          onSubmit={handleSecurityQuestionsSubmit}
          className="flex flex-col gap-5"
        >
          {/* QUESTION 1 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="security-question-1"
              className="text-xs font-medium text-white/75"
            >
              Security question 1
            </label>

            <select
              id="security-question-1"
              value={selectedQuestions[0]}
              onChange={(e) => handleQuestionChange(0, e.target.value)}
              required
              className="
                h-11
                w-full
                rounded-[13px]
                border border-white/[0.09]
                bg-white/[0.055]
                px-3.5
                text-[13px]
                text-white
                outline-none
                transition-[border-color,background-color,box-shadow]
                hover:bg-white/[0.07]
                focus:border-white/20
                focus:bg-white/[0.075]
                focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)]
              "
            >
              <option value="" className="bg-[#202226] text-white">
                Select the question you chose
              </option>

              {questions.map((question) => (
                <option
                  key={question}
                  value={question}
                  disabled={selectedQuestions[1] === question}
                  className="bg-[#202226] text-white"
                >
                  {question}
                </option>
              ))}
            </select>

            <AuthField
              label="Answer"
              type="text"
              name="answer-1"
              value={answers[0]}
              onChange={(e) => handleAnswerChange(0, e.target.value)}
              placeholder="Type your answer"
              autoComplete="off"
              required
            />
          </div>

          {/* QUESTION 2 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="security-question-2"
              className="text-xs font-medium text-white/75"
            >
              Security question 2
            </label>

            <select
              id="security-question-2"
              value={selectedQuestions[1]}
              onChange={(e) => handleQuestionChange(1, e.target.value)}
              required
              className="
                h-11
                w-full
                rounded-[13px]
                border border-white/[0.09]
                bg-white/[0.055]
                px-3.5
                text-[13px]
                text-white
                outline-none
                transition-[border-color,background-color,box-shadow]
                hover:bg-white/[0.07]
                focus:border-white/20
                focus:bg-white/[0.075]
                focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)]
              "
            >
              <option value="" className="bg-[#202226] text-white">
                Select the question you chose
              </option>

              {questions.map((question) => (
                <option
                  key={question}
                  value={question}
                  disabled={selectedQuestions[0] === question}
                  className="bg-[#202226] text-white"
                >
                  {question}
                </option>
              ))}
            </select>

            <AuthField
              label="Answer"
              type="text"
              name="answer-2"
              value={answers[1]}
              onChange={(e) => handleAnswerChange(1, e.target.value)}
              placeholder="Type your answer"
              autoComplete="off"
              required
            />
          </div>

          <Button
            type="submit"
            pill
            disabled={isLoading}
            className="!py-2.5 text-xs"
          >
            {isLoading ? "Verifying..." : "Verify and continue"}
          </Button>
        </form>
      )}

      {/* STEP 3: NEW PASSWORD */}
      {step === STEP_RESET && (
        <form
          onSubmit={handleResetPasswordSubmit}
          className="flex flex-col gap-4"
        >
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

      {/* STEP 4: SUCCESS */}
      {step === STEP_DONE && (
        <div className="flex flex-col gap-4">
          <div
            className="
              rounded-[14px]
              border border-emerald-400/15
              bg-emerald-400/[0.06]
              px-4
              py-4
              text-center
            "
          >
            <p className="text-sm font-medium text-white">
              Password reset successful
            </p>

            <p className="mt-1.5 text-xs leading-5 text-white/50">
              Your password has been changed. You can now log in using your new
              password.
            </p>
          </div>

          <Button
            type="button"
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
