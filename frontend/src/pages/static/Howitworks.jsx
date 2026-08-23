const steps = [
  {
    title: "Search the map, not just a list",
    body: "Filter by price, location, and property type. Every listing shows up as a pin, so you see exactly where it sits in the valley before you click in.",
  },
  {
    title: "Compare and save",
    body: "Open a listing to see photos, price, and details. Save the ones you like so you can come back and compare later.",
  },
  {
    title: "Contact the owner directly",
    body: "Reach out to the property owner straight from the listing page — no middleman, no waiting on a broker to call back.",
  },
];

export default function HowItWorks() {
  return (
    <div className="app-shell" style={{ padding: "64px 32px" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          marginBottom: 40,
        }}
      >
        How it works
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          maxWidth: 640,
        }}
      >
        {steps.map((step, i) => (
          <div key={step.title} style={{ display: "flex", gap: 20 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--color-brass)",
                flexShrink: 0,
                width: 32,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.7 }}>
                {step.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}