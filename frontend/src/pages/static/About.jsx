export default function About() {
  return (
    <main className="w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-5">
            About Rentora
          </h1>

          <p className="text-[15px] sm:text-base leading-7 text-ink/70">
            Rentora is a rental search platform built around the Kathmandu
            valley housing market. Instead of scrolling endless listings with no
            sense of where they actually are, Rentora puts the map first — so
            you can see price, location, and commute distance together before
            you ever click into a listing.
          </p>

          <p className="text-[15px] sm:text-base leading-7 text-ink/70 mt-5">
            We're just getting started, and we're building this with renters and
            property owners in the valley in mind — from students looking for a
            shared room near Koteshwor to families searching for a flat in
            Boudha.
          </p>
        </div>
      </div>
    </main>
  );
}
