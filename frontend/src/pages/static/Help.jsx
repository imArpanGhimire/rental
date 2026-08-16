const faqs = [
  {
    q: "How do I contact a property owner?",
    a: "Open any listing and use the contact details or message option on the listing page.",
  },
  {
    q: "How do I list my own property?",
    a: "Log in as a property owner and select \"List your property\" from the footer or navigation. If you don't have an account yet, you'll be asked to sign up first.",
  },
  {
    q: "Can I save listings to look at later?",
    a: "Yes — use the save option on any listing card. You can view your saved listings from your dashboard.",
  },
  {
    q: "Is Rentora free to use?",
    a: "Yes, browsing and contacting owners is free for renters. There's no fee to list a property either.",
  },
];

export default function Help() {
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
        Help center
      </h1>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
        {faqs.map((item, i) => (
          <div
            key={item.q}
            style={{
              padding: "20px 0",
              borderTop: i === 0 ? "1px solid var(--color-stone)" : "none",
              borderBottom: "1px solid var(--color-stone)",
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
              {item.q}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.7 }}>
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
