import { ShieldCheck, Database, Cog, Mail } from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";

const sections = [
  {
    id: "information-we-collect",
    icon: Database,
    title: "Information we collect",
    body: "When you create an account, we collect your name, email address, and role (renter or owner). If you list a property, we also store the listing details and photos you provide.",
  },
  {
    id: "how-we-use-it",
    icon: Cog,
    title: "How we use it",
    body: "We use your information to run your account, show your listings or saved properties, and let renters and owners contact each other. We don't sell your data to third parties.",
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact",
    body: "Questions about this policy can be sent through the Help center.",
  },
];

export default function Privacy() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-8 sm:py-12">
        {/* HERO */}
        <div className="flex flex-col items-start gap-4 mb-3">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brass-light to-brass flex items-center justify-center shadow-[0_8px_20px_rgba(15,122,108,0.18)]">
            <ShieldCheck size={22} className="text-ivory" strokeWidth={1.75} />
          </span>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Privacy policy
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
