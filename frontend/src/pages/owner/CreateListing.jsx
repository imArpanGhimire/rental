import {
  Home,
  PlusCircle,
  Heart,
  Settings,
  MessageSquare,
  Compass,
  Building2,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import CreateListingForm from "../../features/listings/components/CreateListingForm.jsx";

const links = [
  {
    to: "/owner",
    label: "Overview",
    icon: Home,
    end: true,
  },
  {
    to: "/owner/listings",
    label: "My Listings",
    icon: Compass,
  },
  {
    to: "/owner/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    to: "/owner/favorites",
    label: "Favorites",
    icon: Heart,
  },
  {
    to: "/owner/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function CreateListing() {
  return (
    <AppShell sidebar={<Sidebar links={links} />}>
      <div className="space-y-6">
        <section
          className="
            relative overflow-hidden rounded-[30px] border border-black/[0.06]
            bg-gradient-to-br from-[#f3f2ee] via-[#e9e8e4] to-[#d8d7d3]
            px-6 py-7 shadow-[0_20px_60px_rgba(20,23,31,0.055)]
            sm:px-8 sm:py-8
            dark:border-white/[0.06]
            dark:from-[#1c1f26] dark:via-[#181b20] dark:to-[#121419]
            dark:shadow-none
          "
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/50 blur-3xl dark:bg-white/[0.03]" />

          <div className="relative flex max-w-2xl items-start gap-4">
            <div
              className="
                mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl
                border border-black/[0.07] bg-white/55 text-[#202226]
                shadow-[0_10px_28px_rgba(20,23,31,0.055)]
                dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white
              "
            >
              <Building2 size={18} strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#2b2d31]/42 dark:text-white/40">
                Property management
              </p>

              <h1 className="mt-2 font-display text-[30px] font-bold tracking-[-0.045em] text-[#202226] sm:text-[36px] dark:text-white">
                Create a new listing
              </h1>

              <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#2b2d31]/58 dark:text-white/52">
                Add the property details, choose its exact location and upload
                photos before publishing it to Rentora.
              </p>
            </div>
          </div>
        </section>

        <CreateListingForm />
      </div>
    </AppShell>
  );
}
