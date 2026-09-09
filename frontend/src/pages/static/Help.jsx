import {
  Bookmark,
  Home as HomeIcon,
  LifeBuoy,
  Search,
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

const topics = [
  {
    icon: Search,
    title: "Finding rentals",
    body: "Search, map browsing and property filters.",
  },
  {
    icon: Bookmark,
    title: "Saved listings",
    body: "Keep properties you want to revisit later.",
  },
  {
    icon: HomeIcon,
    title: "For owners",
    body: "Create and manage your rental properties.",
  },
];

export default function Help() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1080px] space-y-6">
        {/* HERO */}
        <section
          className="
            relative overflow-hidden rounded-[30px]
            border border-black/[0.06]
            bg-gradient-to-br
            from-[#f3f2ee] via-[#e9e8e4] to-[#d8d7d3]
            px-6 py-8
            shadow-[0_20px_60px_rgba(20,23,31,0.055)]
            sm:px-8 sm:py-10
            dark:border-white/[0.06]
            dark:from-[#1c1f26]
            dark:via-[#181b20]
            dark:to-[#121419]
            dark:shadow-none
          "
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/50 blur-3xl dark:bg-white/[0.03]" />

          <div className="relative max-w-2xl">
            <span
              className="
                flex h-11 w-11 items-center justify-center
                rounded-2xl
                border border-black/[0.07]
                bg-white/55
                text-[#202226]
                shadow-[0_10px_28px_rgba(20,23,31,0.055)]
                dark:border-white/[0.08]
                dark:bg-white/[0.05]
                dark:text-white
              "
            >
              <LifeBuoy size={18} strokeWidth={1.8} />
            </span>

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#2b2d31]/42 dark:text-white/40">
              Help center
            </p>

            <h1 className="mt-2 font-display text-[30px] font-bold tracking-[-0.045em] text-[#202226] sm:text-[38px] dark:text-white">
              Quick answers when you need them.
            </h1>

            <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#2b2d31]/58 dark:text-white/52">
              Find help with searching for properties, saving listings,
              contacting owners and managing your Rentora account.
            </p>
          </div>
        </section>

        {/* QUICK TOPICS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {topics.map((topic) => {
            const Icon = topic.icon;

            return (
              <div
                key={topic.title}
                className="
                  rounded-[22px]
                  border border-black/[0.07]
                  bg-white/[0.48]
                  p-5
                  shadow-[0_14px_38px_rgba(20,23,31,0.035)]
                  transition-colors
                  hover:bg-white/[0.65]
                  dark:border-white/[0.07]
                  dark:bg-white/[0.025]
                  dark:shadow-none
                  dark:hover:bg-white/[0.04]
                "
              >
                <span
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-[13px]
                    border border-black/[0.06]
                    bg-white/55
                    text-[#2b2d31]/55
                    dark:border-white/[0.07]
                    dark:bg-white/[0.04]
                    dark:text-white/48
                  "
                >
                  <Icon size={15} strokeWidth={1.8} />
                </span>

                <h3 className="mt-4 text-[13px] font-semibold text-[#202226] dark:text-white">
                  {topic.title}
                </h3>

                <p className="mt-1.5 text-[11px] leading-5 text-[#2b2d31]/48 dark:text-white/42">
                  {topic.body}
                </p>
              </div>
            );
          })}
        </section>

        {/* FAQ */}
        <section
          className="
            overflow-hidden rounded-[26px]
            border border-black/[0.07]
            bg-white/[0.52]
            shadow-[0_18px_52px_rgba(20,23,31,0.045)]
            backdrop-blur
            dark:border-white/[0.07]
            dark:bg-white/[0.025]
            dark:shadow-none
          "
        >
          <div className="border-b border-black/[0.06] px-5 py-5 sm:px-6 dark:border-white/[0.07]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#2b2d31]/38 dark:text-white/35">
              Frequently asked
            </p>

            <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.035em] text-[#202226] dark:text-white">
              Common questions
            </h2>

            <p className="mt-1 text-[11px] leading-5 text-[#2b2d31]/46 dark:text-white/40">
              Click a question to view its answer.
            </p>
          </div>

          <div className="px-5 sm:px-6">
            {faqs.map((item, index) => (
              <AccordionItem
                key={item.q}
                question={item.q}
                answer={item.a}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        </section>

        {/* SUPPORT STRIP */}
        <section
          className="
            flex flex-col gap-5
            rounded-[24px]
            border border-black/[0.07]
            bg-[#202226]
            px-6 py-6
            text-white
            sm:flex-row sm:items-center sm:justify-between
            dark:border-white/[0.07]
            dark:bg-[#111318]
          "
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
              Need more help?
            </p>

            <h3 className="mt-2 font-display text-lg font-bold tracking-[-0.03em]">
              Check the answers above first.
            </h3>

            <p className="mt-1 max-w-lg text-[11px] leading-5 text-white/43">
              We're keeping Rentora simple, so most common account and property
              questions should be covered here.
            </p>
          </div>

          <span
            className="
              inline-flex shrink-0 items-center
              rounded-full border border-white/[0.09]
              bg-white/[0.06]
              px-4 py-2
              text-[10px] font-semibold text-white/65
            "
          >
            Rentora Help
          </span>
        </section>
      </div>
    </AppShell>
  );
}
