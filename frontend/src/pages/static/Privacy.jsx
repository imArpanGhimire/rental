export default function Privacy() {
  return (
    <div className="app-shell" style={{ padding: "64px 32px" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          marginBottom: 16,
        }}
      >
        Privacy policy
      </h1>
      <p style={{ fontSize: 13, opacity: 0.5, marginBottom: 32 }}>
        Last updated: August 2026
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 640,
        }}
      >
        <section>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            Information we collect
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.7 }}>
            When you create an account, we collect your name, email address, and
            role (renter or owner). If you list a property, we also store the
            listing details and photos you provide.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            How we use it
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.7 }}>
            We use your information to run your account, show your listings or
            saved properties, and let renters and owners contact each other. We
            don't sell your data to third parties.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            Contact
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.7 }}>
            Questions about this policy can be sent through the Help center.
          </p>
        </section>
      </div>
    </div>
  );
}
