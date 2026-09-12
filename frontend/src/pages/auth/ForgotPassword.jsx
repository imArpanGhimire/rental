import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ShieldCheck } from "lucide-react";

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
  [STEP_QUESTIONS]: "Choose your security questions and answer them.",
  [STEP_RESET]: "Choose a new password.",
  [STEP_DONE]: "All set.",
};

const EMPTY_ANSWERS = [
  { question: "", answer: "" },
  { question: "", answer: "" },
];

export default function ForgetPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState("");
  const [questionOptions, setQuestionOptions] = useState([]);
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateAnswer(index, field, value) {
    setAnswers((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function optionsFor(index) {
    const otherIndex = index === 0 ? 1 : 0;
    const otherQuestion = answers[otherIndex]?.question;

    return questionOptions.filter(
      (question) =>
        question !== otherQuestion || question === answers[index]?.question,
    );
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Enter the email on your account.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await getAccountSecurityQuestions(normalizedEmail);
      const availableQuestions = Array.isArray(data?.questions)
        ? data.questions
        : [];

      if (availableQuestions.length < 2) {
        throw new Error("Security questions are unavailable right now.");
      }

      setQuestionOptions(availableQuestions);
      setAnswers(EMPTY_ANSWERS.map((item) => ({ ...item })));
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

    const [first, second] = answers;

    if (!first.question || !second.question) {
      setError("Please select both security questions.");
      return;
    }

    if (first.question === second.question) {
      setError("Please choose two different security questions.");
      return;
    }

    if (!first.answer.trim() || !second.answer.trim()) {
      setError("Please answer both security questions.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        answers: answers.map((item) => ({
          question: item.question,
          answer: item.answer.trim(),
        })),
      };

      const data = await verifySecurityAnswers(payload);
      setResetToken(data.resetToken);
      setStep(STEP_RESET);
    } catch (err) {
      setError(
        err.message || "Those questions or answers don't match our records.",
      );
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

    if (!resetToken) {
      setError("Your reset session is invalid. Please start again.");
      setStep(STEP_EMAIL);
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
        <p className="mb-4 text-center text-xs text-red-600">{error}</p>
      )}

      {step === STEP_EMAIL && (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <AuthField
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

      {step === STEP_QUESTIONS && (
        <form onSubmit={handleAnswersSubmit} className="flex flex-col gap-4">
          <div className="rounded-[18px] border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/55">
                <ShieldCheck size={15} strokeWidth={1.8} />
              </span>

              <div>
                <p className="text-[11px] font-semibold text-white/80">
                  Verify account recovery
                </p>
                <p className="mt-0.5 text-[9px] leading-4 text-white/45">
                  Select the two questions you used when creating this account,
                  then enter the matching answers.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[0, 1].map((index) => (
                <div key={index} className="space-y-2">
                  <label
                    htmlFor={`forgotSecurityQuestion-${index}`}
                    className="text-[11px] font-semibold text-white/75"
                  >
                    Security question {index + 1}
                  </label>

                  <div className="relative">
                    <select
                      id={`forgotSecurityQuestion-${index}`}
                      name={`forgotSecurityQuestion-${index}`}
                      value={answers[index]?.question || ""}
                      onChange={(e) =>
                        updateAnswer(index, "question", e.target.value)
                      }
                      required
                      className="h-11 w-full appearance-none rounded-[13px] border border-white/[0.09] bg-[#1a1d22] px-3.5 pr-10 text-[12px] text-white outline-none transition-[border-color,background-color,box-shadow] hover:bg-[#1e2127] focus:border-white/20 focus:bg-[#1e2127] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)]"
                    >
                      <option value="" disabled>
                        Select a question
                      </option>

                      {optionsFor(index).map((question) => (
                        <option key={question} value={question}>
                          {question}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={14}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50"
                    />
                  </div>

                  <AuthField
                    label="Answer"
                    type="text"
                    name={`forgotSecurityAnswer-${index}`}
                    value={answers[index]?.answer || ""}
                    onChange={(e) =>
                      updateAnswer(index, "answer", e.target.value)
                    }
                    autoComplete="off"
                    required
                  />
                </div>
              ))}
            </div>
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
          <p className="text-center text-sm text-ink/70">
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
