// src/features/auth/components/SecurityQuestionsFields.jsx
import { useEffect, useState } from "react";
import AuthField from "../../../components/ui/AuthField";
import { getSecurityQuestionsList } from "../../../api/auth.api";

/**
 * @param {{
 *   value: { question: string, answer: string }[],
 *   onChange: (next: { question: string, answer: string }[]) => void
 * }} props
 */
export default function SecurityQuestionsFields({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getSecurityQuestionsList()
      .then((data) => {
        // handle either ["question", ...] or [{ question: "..." }, ...]
        const list = Array.isArray(data?.questions) ? data.questions : data;
        const normalized = (list || []).map((item) =>
          typeof item === "string" ? item : item.question,
        );
        setOptions(normalized);
      })
      .catch(() => setLoadError("Couldn't load security questions."));
  }, []);

  function handleQuestionChange(index, question) {
    const next = [...value];
    next[index] = { ...next[index], question };
    onChange(next);
  }

  function handleAnswerChange(index, answer) {
    const next = [...value];
    next[index] = { ...next[index], answer };
    onChange(next);
  }

  // prevent picking the same question twice
  function optionsFor(index) {
    const otherChosen = value[(index + 1) % 2]?.question;
    return options.filter(
      (q) => q !== otherChosen || q === value[index]?.question,
    );
  }

  if (loadError) {
    return <p className="text-xs text-red-600">{loadError}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {[0, 1].map((index) => (
        <div key={index} className="flex flex-col gap-2">
          <label className="text-xs font-medium text-ink/70">
            Security question {index + 1}
          </label>
          <select
            name={`securityQuestion-${index}`}
            value={value[index]?.question || ""}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            required
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Select a question
            </option>
            {optionsFor(index).map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>

          <AuthField
            label="Answer"
            type="text"
            name={`securityAnswer-${index}`}
            value={value[index]?.answer || ""}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            required
          />
        </div>
      ))}
    </div>
  );
}
