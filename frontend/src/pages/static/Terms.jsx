import { FileText, KeyRound, ListChecks, ShieldAlert } from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";

const sections = [
  {
    id: "using-rentora",
    icon: ListChecks,
    title: "Using Rentora",
    body: "Rentora connects renters and property owners in the Kathmandu valley. By using the site, you agree to provide accurate information in your account and listings.",
  },
  {
    id: "listings",
    icon: ShieldAlert,
    title: "Listings",
    body: "Property owners are responsible for the accuracy of their listings, including price, photos, and availability. Rentora does not verify listings and is not a party to any rental agreement made between users.",
  },
  {
    id: "account-responsibility",
    icon: KeyRound,
    title: "Account responsibility",
    body: "You're responsible for keeping your login credentials secure and for any activity that happens under your account.",
  },
];

export default function Terms() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-8 sm:py-12">
        {/* HERO */}
        <div className="flex flex-col items-start gap-4 mb-3">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brass-light to-brass flex items-center justify-center shadow-[0_8px_20px_rgba(15,122,108,0.18)]">
            <FileText size={22} className="text-ivory" strokeWidth={1.75} />
          </span>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Terms of service
          </h1>
        </div>

        <p className="text-xs text-text/45 mb-10">Last updated: August 2026</p>

        {/* SECTIONS */}
        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="rounded-2xl border border-stone bg-bg p-5 sm:p-6 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-9 h-9 rounded-xl bg-brass-light flex items-center justify-center shrink-0">
                  <section.icon
                    size={16}
                    className="text-brass"
                    strokeWidth={1.75}
                  />
                </span>
                <h3 className="text-[15px] font-semibold text-text">
                  {section.title}
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-text/65">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
