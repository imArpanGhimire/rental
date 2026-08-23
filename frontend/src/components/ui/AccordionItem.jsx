import { useState } from "react";
import { ChevronDown } from "lucide-react";

/*
 * A single expand/collapse row. Click the question to open the
 * answer, click again to close it. Height animates via a CSS grid
 * trick (0fr -> 1fr) so we don't need to measure content height in JS,
 * combined with an opacity + slide fade on the content for a softer feel.
 */
export default function AccordionItem({
  question,
  answer,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-stone last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="font-semibold text-text text-[15px] sm:text-base">
          {question}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-text/40 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:text-brass ${
            open ? "rotate-180 text-brass" : ""
          }`}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p
            className={`text-sm sm:text-[15px] leading-relaxed text-text/65 pb-5 pr-6 sm:pr-10 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1.5"
            }`}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
