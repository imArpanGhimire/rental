import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../ui/Logo.jsx";

const SLIDES = [
  {
    heading: (
      <>
        Direct from owner.
        <br />
        No middlemen.
      </>
    ),
    body: "Find verified hostel rooms, rental rooms, and flats across the Kathmandu valley — with no agents, no markups, no guesswork.",
  },
  {
    heading: (
      <>
        List it once.
        <br />
        Reach real renters.
      </>
    ),
    body: "Owners publish a listing in minutes and connect directly with renters actively searching the valley.",
  },
  {
    heading: (
      <>
        No surprises.
        <br />
        Just clarity.
      </>
    ),
    body: "Every listing shows real photos, real pricing, and real amenities — no guesswork before you visit.",
  },
];

export default function AuthLayout({
  children,
  title,
  subtitle,
  topLinkLabel,
  topLinkText,
  topLinkTo,
}) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = (index) => {
    if (index === active) return;
    setVisible(false);
    setTimeout(() => {
      setActive(index);
      setVisible(true);
    }, 350);
  };

  useEffect(() => {
    const id = setInterval(() => {
      goTo((active + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, [active]);

  const slide = SLIDES[active];

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-ivory">
      <div className="hidden md:flex flex-col relative overflow-hidden bg-gradient-to-br from-[#26210f] via-[#1b1a17] to-[#0d0c0a]">
        <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-brass/25 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-brass/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative h-full px-14 py-14 grid grid-rows-[auto_1fr_auto]">
          <Logo variant="light" />

          <div className="grid place-items-center text-center">
            <div
              className="flex flex-col items-center gap-6 max-w-sm transition-all duration-500 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
              }}
            >
              <span className="h-px w-10 bg-brass" />
              <h2 className="font-display text-4xl text-ivory leading-snug">
                {slide.heading}
              </h2>
              <p className="text-base text-ivory/55 leading-relaxed">
                {slide.body}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === active ? "w-8 bg-brass" : "w-4 bg-ivory/15 hover:bg-ivory/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-ivory px-6 sm:px-14 py-10 md:py-14">
        <div className="flex items-center justify-between min-h-11">
          <Logo variant="dark" className="md:hidden" />
          {topLinkTo && (
            <p className="text-sm text-ink/60 ml-auto">
              {topLinkLabel}{" "}
              <Link to={topLinkTo} className="text-brass font-semibold hover:underline underline-offset-2">
                {topLinkText}
              </Link>
            </p>
          )}
        </div>

        <div className="flex-1 grid place-items-center">
          <div className="w-full max-w-[380px]">
            <h1 className="font-display text-3xl sm:text-4xl text-ink mb-1.5 text-center">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-ink/55 text-center mb-9">
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-ink/40">
          <span>© 2026 Rentora</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brass transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brass transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
