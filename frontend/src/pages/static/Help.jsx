import {
  LifeBuoy,
  Search,
  Home as HomeIcon,
  Bookmark,
  Wallet,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";
import AccordionItem from "../../components/ui/AccordionItem.jsx";

const faqs = [
  {
    icon: Search,
    q: "How do I contact a property owner?",
    a: "Open any listing and use the contact details or message option on the listing page.",
  },
  {
    icon: HomeIcon,
    q: "How do I list my own property?",
    a: "Log in as a property owner and select \"List your property\" from the footer or navigation. If you don't have an account yet, you'll be asked to sign up first.",
  },
  {
    icon: Bookmark,
    q: "Can I save listings to look at later?",
    a: "Yes — use the save option on any listing card. You can view your saved listings from your dashboard.",
  },
  {
    icon: Wallet,
    q: "Is Rentora free to use?",
    a: "Yes, browsing and contacting owners is free for renters. There's no fee to list a property either.",
  },
];

export default function Help() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-8 sm:py-12">
        {/* HERO */}
        <div className="flex flex-col items-start gap-4 mb-10 sm:mb-12">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brass-light to-brass flex items-center justify-center shadow-[0_8px_20px_rgba(15,122,108,0.18)]">
            <LifeBuoy size={22} className="text-ivory" strokeWidth={1.75} />
          </span>

          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              Help center
            </h1>
            <p className="text-sm sm:text-base text-text/60 mt-2 max-w-lg">
              Quick answers to the most common questions. Click a question to
              expand it.
            </p>
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div className="rounded-2xl border border-stone bg-bg shadow-[0_1px_2px_rgba(20,20,26,0.04),0_8px_24px_rgba(20,20,26,0.05)] px-5 sm:px-6">
          {faqs.map((item, i) => (
            <AccordionItem
              key={item.q}
              question={item.q}
              answer={item.a}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
