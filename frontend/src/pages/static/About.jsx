export default function About() {
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
        About Rentora
      </h1>
      <p
        style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.75, maxWidth: 640 }}
      >
        Rentora is a rental search platform built around the Kathmandu valley
        housing market. Instead of scrolling endless listings with no sense of
        where they actually are, Rentora puts the map first — so you can see
        price, location, and commute distance together before you ever click
        into a listing.
      </p>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          opacity: 0.75,
          maxWidth: 640,
          marginTop: 16,
        }}
      >
        We're just getting started, and we're building this with renters and
        property owners in the valley in mind — from students looking for a
        shared room near Koteshwor to families searching for a flat in Boudha.
      </p>
    </div>
  );
}
