import { useEffect, useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";

import AuthField from "../../../components/ui/AuthField";
import { getSecurityQuestionsList } from "../../../api/auth.api";

export default function SecurityQuestionsFields({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getSecurityQuestionsList()
      .then((data) => {
        const list = Array.isArray(data?.questions) ? data.questions : data;

        const normalized = (list || []).map((item) =>
          typeof item === "string" ? item : item.question,
        );

        setOptions(normalized);
      })
      .catch(() => {
        setLoadError("Couldn't load security questions.");
      });
  }, []);

  function handleQuestionChange(index, question) {
    const next = [...value];

    next[index] = {
      ...next[index],
      question,
    };

    onChange(next);
  }

  function handleAnswerChange(index, answer) {
    const next = [...value];

    next[index] = {
      ...next[index],
      answer,
    };

    onChange(next);
  }

  function optionsFor(index) {
    const otherChosen = value[(index + 1) % 2]?.question;

    return options.filter(
      (question) =>
        question !== otherChosen || question === value[index]?.question,
    );
  }

  if (loadError) {
    return (
      <div className="rounded-[14px] border border-rose-200/70 bg-rose-50/70 px-3.5 py-3 text-[11px] text-rose-700 dark:border-rose-400/15 dark:bg-rose-400/10 dark:text-rose-300">
        {loadError}
      </div>
    );
  }

  return (
    <section
      className="
        mt-5 rounded-[18px] border border-black/[0.07]
        bg-black/[0.018] p-4
        dark:border-white/[0.07] dark:bg-white/[0.018]
      "
    >
      {/* HEADER */}
      <div className="mb-4 flex items-start gap-2.5">
        <span
          className="
            flex h-8 w-8 shrink-0 items-center justify-center rounded-xl
            border border-black/[0.06] bg-white/55 text-[#2b2d31]/50
            dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-white/55
          "
        >
          <ShieldCheck size={14} strokeWidth={1.8} />
        </span>

        <div>
          <p className="text-[11px] font-semibold !text-white/80">
            Account recovery
          </p>

          <p className="mt-0.5 text-[9px] leading-4 !text-white/45">
            Choose two different questions you can answer later.
          </p>
        </div>
      </div>

      {/* QUESTIONS */}
      <div className="space-y-4">
        {[0, 1].map((index) => (
          <div key={index} className="space-y-2">
            <label
              htmlFor={`securityQuestion-${index}`}
              className="text-[11px] font-semibold !text-white/75"
            >
              Security question {index + 1}
            </label>

            <div className="relative">
              <select
                id={`securityQuestion-${index}`}
                name={`securityQuestion-${index}`}
                value={value[index]?.question || ""}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                required
                className="
                  h-11 w-full appearance-none rounded-[13px]
                  border border-black/[0.09] bg-white/55
                  px-3.5 pr-10 text-[12px] text-[#202226]
                  outline-none
                  transition-[border-color,background-color,box-shadow]

                  hover:bg-white/70
                  focus:border-black/20
                  focus:bg-white
                  focus:shadow-[0_0_0_3px_rgba(20,23,31,0.055)]

                  dark:border-white/[0.09]
                  dark:bg-[#1a1d22]
                  dark:text-white
                  dark:hover:bg-[#1e2127]
                  dark:focus:border-white/20
                  dark:focus:bg-[#1e2127]
                  dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)]
                "
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
                className="
                  pointer-events-none
                  absolute right-3.5 top-1/2
                  -translate-y-1/2
                  text-[#2b2d31]/38
                  dark:text-white/50
                "
              />
            </div>

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
    </section>
  );
}
