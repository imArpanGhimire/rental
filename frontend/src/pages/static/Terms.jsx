export default function Terms() {
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
        Terms of service
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
            Using Rentora
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.7 }}>
            Rentora connects renters and property owners in the Kathmandu
            valley. By using the site, you agree to provide accurate information
            in your account and listings.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            Listings
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.7 }}>
            Property owners are responsible for the accuracy of their listings,
            including price, photos, and availability. Rentora does not verify
            listings and is not a party to any rental agreement made between
            users.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            Account responsibility
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.7 }}>
            You're responsible for keeping your login credentials secure and for
            any activity that happens under your account.
          </p>
        </section>
      </div>
    </div>
  );
}
