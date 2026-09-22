export default function Logo({
  name = "Thegana",
  variant = "dark",
  className = "",
}) {
  const isLight = variant === "light";

  return (
    <div
      className={`
        inline-flex items-center gap-2.5
        ${isLight ? "text-white" : "text-ink"}
        ${className}
      `}
    >
      {/* Thegana — rounded home search mark */}
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Rounded house */}
        <path
          d="
            M5.2 14.3
            L13.9 6.9
            C15.1 5.9 16.9 5.9 18.1 6.9
            L26.8 14.3
            C27.5 14.9 27.9 15.8 27.9 16.7
            V25
            C27.9 26.7 26.6 28 24.9 28
            H7.1
            C5.4 28 4.1 26.7 4.1 25
            V16.7
            C4.1 15.8 4.5 14.9 5.2 14.3
            Z
          "
          stroke="currentColor"
          strokeWidth="2.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Rounded chimney */}
        <path
          d="
            M23.3 11.3
            V7.8
            C23.3 7.1 23.8 6.6 24.5 6.6
            H25.8
            C26.5 6.6 27 7.1 27 7.8
            V14.4
          "
          stroke="currentColor"
          strokeWidth="2.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Search circle */}
        <circle
          cx="14.7"
          cy="17.4"
          r="4.25"
          stroke="currentColor"
          strokeWidth="2.7"
        />

        {/* Search handle */}
        <path
          d="M17.8 20.5L22.1 24.8"
          stroke="currentColor"
          strokeWidth="2.7"
          strokeLinecap="round"
        />
      </svg>

      {/* Wordmark */}
      <span
        className="
          font-display
          text-lg
          font-bold
          tracking-[-0.035em]
          leading-none
        "
      >
        {name}
      </span>
    </div>
  );
}
