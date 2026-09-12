import { ArrowRight, Map, MousePointer2, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

export default function MapSearchShowcase() {
  return (
    <section className="overflow-hidden rounded-[26px] border border-stone bg-bg">
      <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="flex flex-col justify-center px-6 py-9 sm:px-9 sm:py-12 lg:px-11 lg:py-14">
          <div className="flex w-fit items-center gap-2 rounded-full border border-stone bg-ivory/55 px-3 py-1.5">
            <Map size={13} strokeWidth={1.8} className="text-brass" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/50">
              Map search
            </span>
          </div>

          <h2 className="mt-6 max-w-[500px] font-display text-[30px] font-bold leading-[1.08] tracking-[-0.045em] text-ink sm:text-[38px]">
            Search the area,
            <span className="block text-ink/45">not just the address.</span>
          </h2>

          <p className="mt-4 max-w-[470px] text-[14px] leading-6 text-ink/50">
            Draw around the part of the city you want to live in and Rentora
            will show you the rentals inside it.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/browse"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-ink
                px-5
                py-3
                text-[12px]
                font-semibold
                text-ivory
                no-underline
                transition-opacity
                hover:opacity-90
              "
            >
              Open map search
              <ArrowRight size={14} strokeWidth={1.8} />
            </Link>

            <span className="text-[11px] text-ink/35">
              Draw · search · compare
            </span>
          </div>
        </div>

        {/* =====================================================
            MAP PREVIEW
        ===================================================== */}

        <div className="border-t border-stone bg-ivory/55 p-4 sm:p-6 lg:border-l lg:border-t-0">
          <div
            className="
              relative
              min-h-[330px]
              overflow-hidden
              rounded-[20px]
              border
              border-stone
              bg-bg
              sm:min-h-[380px]
            "
          >
            {/* subtle map grid */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.55]
                dark:opacity-[0.22]
              "
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(120,120,120,0.08) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(120,120,120,0.08) 1px, transparent 1px)
                `,
                backgroundSize: "42px 42px",
              }}
            />

            {/* roads */}

            <svg
              viewBox="0 0 700 400"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <path
                d="M-40 310 C80 255 115 295 210 225 C300 158 348 186 430 120 C505 61 596 72 745 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-ink/[0.08]"
              />

              <path
                d="M40 -20 C110 68 168 76 230 138 C298 204 340 292 392 430"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-ink/[0.07]"
              />

              <path
                d="M120 410 C180 310 275 304 346 254 C425 199 530 205 720 244"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-ink/[0.06]"
              />
            </svg>

            {/* location names */}

            <span className="absolute left-[18%] top-[18%] text-[10px] font-medium text-ink/25">
              Kathmandu
            </span>

            <span className="absolute bottom-[18%] left-[34%] text-[10px] font-medium text-ink/25">
              Lalitpur
            </span>

            <span className="absolute right-[12%] top-[35%] text-[10px] font-medium text-ink/25">
              Bhaktapur
            </span>

            {/* search area */}

            <div
              className="
                absolute
                left-[25%]
                top-[24%]
                h-[48%]
                w-[53%]
                rotate-[-3deg]
                rounded-[45%_55%_43%_57%/51%_43%_57%_49%]
                border-[1.5px]
                border-dashed
                border-brass/80
                bg-brass/[0.055]
              "
            />

            {/* markers */}

            <div className="absolute left-[37%] top-[37%] rounded-full border border-stone bg-bg px-3 py-1.5 shadow-sm">
              <span className="text-[10px] font-bold text-ink">Rs. 18k</span>
            </div>

            <div className="absolute right-[27%] top-[48%] rounded-full border border-stone bg-bg px-3 py-1.5 shadow-sm">
              <span className="text-[10px] font-bold text-ink">Rs. 25k</span>
            </div>

            <div className="absolute bottom-[24%] left-[47%] rounded-full border border-stone bg-bg px-3 py-1.5 shadow-sm">
              <span className="text-[10px] font-bold text-ink">Rs. 32k</span>
            </div>

            {/* search indicator */}

            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-stone bg-bg/90 px-3 py-2 shadow-sm backdrop-blur-md">
              <Navigation size={12} strokeWidth={1.8} className="text-brass" />

              <span className="text-[10px] font-semibold text-ink/60">
                Kathmandu Valley
              </span>
            </div>

            {/* draw control */}

            <div
              className="
                absolute
                bottom-4
                left-4
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-stone
                bg-bg/95
                px-3
                py-2.5
                shadow-sm
                backdrop-blur-md
              "
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brass-light text-brass">
                <MousePointer2 size={14} strokeWidth={1.8} />
              </span>

              <span>
                <span className="block text-[10px] font-semibold text-ink">
                  Draw an area
                </span>

                <span className="mt-0.5 block text-[9px] text-ink/35">
                  Drag anywhere on the map
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
