import { useMemo, useState } from "react";

import {
  AlertTriangle,
  Bug,
  Check,
  ChevronDown,
  Lightbulb,
  LifeBuoy,
  Loader2,
  Mail,
  MessageSquareText,
  MonitorCog,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useLocation } from "react-router-dom";

import AppShell from "../../components/layout/AppShell.jsx";

import { useAuth } from "../../features/auth/AuthContext.jsx";

import { sendSupportReport } from "../../api/support.api.js";

/* =========================================================
   ISSUE TYPES
========================================================= */

const ISSUE_TYPES = [
  {
    value: "bug",
    label: "Bug",
    description: "Something isn't working as expected.",
    icon: Bug,
  },

  {
    value: "technical",
    label: "Technical issue",
    description: "Loading, performance, map or system problems.",
    icon: MonitorCog,
  },

  {
    value: "listing",
    label: "Listing issue",
    description: "Problems with a property or listing.",
    icon: AlertTriangle,
  },

  {
    value: "account",
    label: "Account issue",
    description: "Profile or account-related problems.",
    icon: UserRound,
  },

  {
    value: "feedback",
    label: "Feedback",
    description: "Ideas or suggestions for Rentora.",
    icon: Lightbulb,
  },

  {
    value: "other",
    label: "Other",
    description: "Anything that doesn't fit the options above.",
    icon: MessageSquareText,
  },
];

/* =========================================================
   SUPPORT PAGE
========================================================= */

export default function Support() {
  const { user, role } = useAuth();

  const location = useLocation();

  const originalPage = location.state?.from || "";

  const [issueType, setIssueType] = useState("bug");

  const [subject, setSubject] = useState("");

  const [description, setDescription] = useState("");

  const [affectedPage, setAffectedPage] = useState(originalPage);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  const selectedIssue = useMemo(
    () => ISSUE_TYPES.find((item) => item.value === issueType),
    [issueType],
  );

  const SelectedIcon = selectedIssue?.icon || Bug;

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (subject.trim().length < 3) {
      setError("Please enter a short subject.");

      return;
    }

    if (description.trim().length < 10) {
      setError("Please describe the problem in a little more detail.");

      return;
    }

    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await sendSupportReport({
        issueType,

        subject: subject.trim(),

        description: description.trim(),

        affectedPage: affectedPage.trim(),

        browserInfo: `${navigator.userAgent} | ${window.innerWidth}x${window.innerHeight}`,
      });

      setSuccess(true);

      setSubject("");
      setDescription("");
    } catch (err) {
      setError(
        err?.message || "We couldn't send your report. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1080px] space-y-6">
        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[30px]
            border border-black/[0.06]
            bg-gradient-to-br
            from-[#f6f5f1]
            via-[#f2f2ee]
            to-[#e9efec]
            px-6 py-8
            shadow-[0_20px_60px_rgba(20,23,31,0.04)]

            sm:px-8
            sm:py-10

            dark:border-white/[0.06]
            dark:from-[#1b1e23]
            dark:via-[#17191d]
            dark:to-[#17201d]
            dark:shadow-none
          "
        >
          {/* Background lines */}

          <svg
            aria-hidden="true"
            viewBox="0 0 900 300"
            className="
              pointer-events-none
              absolute
              right-0 top-0
              h-full w-[70%]
              text-[#426c64]
              opacity-[0.06]

              dark:text-[#8db4aa]
              dark:opacity-[0.06]
            "
          >
            <path
              d="M80 315C155 201 279 250 349 142C424 27 555 93 673 37C755 -2 810 13 916 -27"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="M262 335C342 231 447 260 522 192C594 126 701 142 930 195"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>

          <div
            className="
              pointer-events-none
              absolute
              -right-20 -top-28
              h-72 w-72
              rounded-full
              bg-[#426c64]/[0.055]
              blur-[80px]

              dark:bg-[#8db4aa]/[0.045]
            "
          />

          <div className="relative max-w-2xl">
            <div
              className="
                flex w-fit
                items-center gap-2
                rounded-full
                border border-black/[0.07]
                bg-white/55
                px-3 py-2

                dark:border-white/[0.08]
                dark:bg-white/[0.04]
              "
            >
              <LifeBuoy
                size={13}
                strokeWidth={1.9}
                className="text-[#426c64] dark:text-[#8db4aa]"
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2b2d31]/50 dark:text-white/45">
                Rentora support
              </span>
            </div>

            <h1
              className="
                mt-6
                font-display
                text-[34px]
                font-bold
                tracking-[-0.05em]
                text-[#17191d]

                sm:text-[43px]

                dark:text-white
              "
            >
              Something not working?
            </h1>

            <p className="mt-3 max-w-xl text-[14px] leading-7 text-[#2b2d31]/52 dark:text-white/46">
              Tell us what happened. Bug reports, technical problems and product
              feedback are sent directly to the Rentora support inbox.
            </p>
          </div>
        </section>

        {/* =====================================================
            MAIN
        ===================================================== */}

        <div
          className="
            grid grid-cols-1
            gap-5

            lg:grid-cols-[minmax(0,1fr)_300px]
          "
        >
          {/* ===================================================
              FORM
          =================================================== */}

          <form
            onSubmit={handleSubmit}
            className="
              rounded-[26px]
              border border-black/[0.07]
              bg-white/50
              p-5
              shadow-[0_18px_50px_rgba(20,23,31,0.035)]

              sm:p-6

              dark:border-white/[0.07]
              dark:bg-white/[0.025]
              dark:shadow-none
            "
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#426c64] dark:text-[#8db4aa]">
                Report an issue
              </p>

              <h2 className="mt-1.5 font-display text-[22px] font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
                What happened?
              </h2>

              <p className="mt-1 text-[12px] leading-5 text-[#2b2d31]/43 dark:text-white/38">
                Include enough detail for us to understand and reproduce the
                issue.
              </p>
            </div>

            {/* ISSUE TYPE */}

            <div className="mt-6">
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2b2d31]/48 dark:text-white/43">
                Issue type
              </label>

              <div className="relative">
                <SelectedIcon
                  size={15}
                  strokeWidth={1.8}
                  className="
                    pointer-events-none
                    absolute
                    left-4 top-1/2
                    -translate-y-1/2
                    text-[#426c64]

                    dark:text-[#8db4aa]
                  "
                />

                <select
                  value={issueType}
                  onChange={(event) => setIssueType(event.target.value)}
                  className="
                    h-12 w-full
                    appearance-none
                    rounded-[15px]
                    border border-black/[0.09]
                    bg-white/55
                    pl-11 pr-10
                    text-[13px]
                    font-medium
                    text-[#202226]
                    outline-none
                    transition-colors
                    focus:border-[#426c64]/40

                    dark:border-white/[0.09]
                    dark:bg-white/[0.035]
                    dark:text-white
                    dark:focus:border-[#8db4aa]/40
                  "
                >
                  {ISSUE_TYPES.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                      className="bg-bg text-text"
                    >
                      {type.label}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  strokeWidth={1.8}
                  className="
                    pointer-events-none
                    absolute
                    right-4 top-1/2
                    -translate-y-1/2
                    text-[#2b2d31]/35

                    dark:text-white/35
                  "
                />
              </div>

              <p className="mt-2 text-[10px] text-[#2b2d31]/38 dark:text-white/33">
                {selectedIssue?.description}
              </p>
            </div>

            {/* SUBJECT */}

            <div className="mt-5">
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2b2d31]/48 dark:text-white/43">
                Subject
              </label>

              <input
                type="text"
                value={subject}
                maxLength={120}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="e.g. Map doesn't load after searching"
                className="
                  h-12 w-full
                  rounded-[15px]
                  border border-black/[0.09]
                  bg-white/55
                  px-4
                  text-[13px]
                  text-[#202226]
                  outline-none
                  transition-colors
                  placeholder:text-[#2b2d31]/28
                  focus:border-[#426c64]/40

                  dark:border-white/[0.09]
                  dark:bg-white/[0.035]
                  dark:text-white
                  dark:placeholder:text-white/25
                  dark:focus:border-[#8db4aa]/40
                "
              />
            </div>

            {/* AFFECTED PAGE */}

            <div className="mt-5">
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2b2d31]/48 dark:text-white/43">
                Page or feature
              </label>

              <input
                type="text"
                value={affectedPage}
                onChange={(event) => setAffectedPage(event.target.value)}
                placeholder="e.g. Browse map, visit requests, reviews"
                maxLength={300}
                className="
                  h-12 w-full
                  rounded-[15px]
                  border border-black/[0.09]
                  bg-white/55
                  px-4
                  text-[13px]
                  text-[#202226]
                  outline-none
                  transition-colors
                  placeholder:text-[#2b2d31]/28
                  focus:border-[#426c64]/40

                  dark:border-white/[0.09]
                  dark:bg-white/[0.035]
                  dark:text-white
                  dark:placeholder:text-white/25
                  dark:focus:border-[#8db4aa]/40
                "
              />
            </div>

            {/* DESCRIPTION */}

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-4">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2b2d31]/48 dark:text-white/43">
                  Description
                </label>

                <span className="text-[9px] text-[#2b2d31]/30 dark:text-white/28">
                  {description.length}
                  /5000
                </span>
              </div>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={8}
                maxLength={5000}
                placeholder="What were you trying to do? What happened instead? Include any error message you saw."
                className="
                  w-full
                  resize-none
                  rounded-[17px]
                  border border-black/[0.09]
                  bg-white/55
                  px-4 py-3.5
                  text-[13px]
                  leading-6
                  text-[#202226]
                  outline-none
                  transition-colors
                  placeholder:text-[#2b2d31]/28
                  focus:border-[#426c64]/40

                  dark:border-white/[0.09]
                  dark:bg-white/[0.035]
                  dark:text-white
                  dark:placeholder:text-white/25
                  dark:focus:border-[#8db4aa]/40
                "
              />
            </div>

            {/* ERROR */}

            {error && (
              <div
                className="
                  mt-5
                  flex items-start gap-2.5
                  rounded-[15px]
                  border border-rose-300/50
                  bg-rose-50/65
                  px-4 py-3
                  text-[11px]
                  leading-5
                  text-rose-700

                  dark:border-rose-400/15
                  dark:bg-rose-400/[0.08]
                  dark:text-rose-300
                "
              >
                <AlertTriangle
                  size={14}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0"
                />

                <span>{error}</span>
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div
                className="
      mt-5
      flex items-center
      gap-3
      rounded-[14px]
      border border-black/[0.07]
      bg-black/[0.018]
      px-4 py-3.5

      dark:border-white/[0.07]
      dark:bg-white/[0.025]
    "
              >
                <div
                  className="
        flex h-8 w-8
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-[#426c64]/10
        text-[#426c64]

        dark:bg-[#8db4aa]/10
        dark:text-[#8db4aa]
      "
                >
                  <Check size={14} strokeWidth={2.2} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className="
            text-[12px]
            font-semibold
            text-[#202226]

            dark:text-white/90
          "
                    >
                      Report received
                    </p>

                    <span
                      className="
            h-1 w-1
            rounded-full
            bg-[#426c64]/40

            dark:bg-[#8db4aa]/40
          "
                    />

                    <p
                      className="
            text-[10px]
            font-medium
            text-[#426c64]

            dark:text-[#8db4aa]
          "
                    >
                      Sent successfully
                    </p>
                  </div>

                  <p
                    className="
          mt-0.5
          text-[11px]
          leading-5
          text-[#2b2d31]/45

          dark:text-white/38
        "
                  >
                    Thanks for the report. It has been sent to the Rentora
                    support team.
                  </p>
                </div>
              </div>
            )}

            {/* SUBMIT */}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  inline-flex
                  min-w-[145px]
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#202226]
                  px-5 py-3
                  text-[12px]
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-[#303238]
                  disabled:cursor-not-allowed
                  disabled:opacity-55

                  dark:bg-white
                  dark:text-[#17191d]
                  dark:hover:bg-white/90
                "
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={13} strokeWidth={1.9} />
                    Send report
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ===================================================
              SIDEBAR
          =================================================== */}

          <aside className="space-y-4">
            {/* ACCOUNT */}

            <div
              className="
                rounded-[24px]
                border border-black/[0.07]
                bg-white/45
                p-5

                dark:border-white/[0.07]
                dark:bg-white/[0.025]
              "
            >
              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-xl
                  bg-[#426c64]/[0.07]
                  text-[#426c64]

                  dark:bg-[#8db4aa]/[0.08]
                  dark:text-[#8db4aa]
                "
              >
                <UserRound size={16} strokeWidth={1.8} />
              </div>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#2b2d31]/38 dark:text-white/35">
                Included automatically
              </p>

              <h3 className="mt-1.5 text-[14px] font-semibold text-[#202226] dark:text-white">
                Your account
              </h3>

              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.1em] text-[#2b2d31]/32 dark:text-white/30">
                    Name
                  </p>

                  <p className="mt-0.5 truncate text-[11px] font-medium text-[#202226] dark:text-white/75">
                    {user?.name || "Rentora user"}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.1em] text-[#2b2d31]/32 dark:text-white/30">
                    Email
                  </p>

                  <p className="mt-0.5 break-all text-[11px] font-medium text-[#202226] dark:text-white/75">
                    {user?.email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.1em] text-[#2b2d31]/32 dark:text-white/30">
                    Account type
                  </p>

                  <p className="mt-0.5 text-[11px] font-medium capitalize text-[#202226] dark:text-white/75">
                    {role}
                  </p>
                </div>
              </div>
            </div>

            {/* PRIVACY */}

            <div
              className="
                rounded-[24px]
                border border-black/[0.07]
                bg-[#eef2ef]/70
                p-5

                dark:border-white/[0.07]
                dark:bg-[#8db4aa]/[0.045]
              "
            >
              <ShieldCheck
                size={17}
                strokeWidth={1.8}
                className="text-[#426c64] dark:text-[#8db4aa]"
              />

              <h3 className="mt-3 text-[13px] font-semibold text-[#202226] dark:text-white">
                Useful details are included.
              </h3>

              <p className="mt-2 text-[11px] leading-5 text-[#2b2d31]/46 dark:text-white/40">
                Your account, role and basic browser information are attached to
                the report so technical problems are easier to diagnose.
              </p>
            </div>

            {/* EMAIL */}

            <div
              className="
                rounded-[24px]
                border border-black/[0.07]
                bg-white/45
                p-5

                dark:border-white/[0.07]
                dark:bg-white/[0.025]
              "
            >
              <Mail
                size={17}
                strokeWidth={1.8}
                className="text-[#426c64] dark:text-[#8db4aa]"
              />

              <h3 className="mt-3 text-[13px] font-semibold text-[#202226] dark:text-white">
                Sent directly to support.
              </h3>

              <p className="mt-2 text-[11px] leading-5 text-[#2b2d31]/46 dark:text-white/40">
                Your report is emailed directly to the Rentora support inbox.
                Your email address is attached as the reply address.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
