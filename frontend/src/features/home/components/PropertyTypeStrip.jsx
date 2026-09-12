import { useNavigate } from "react-router-dom";

import {
  BedSingle,
  Building2,
  House,
  Landmark,
  Store,
  Trees,
} from "lucide-react";

const TYPES = [
  {
    value: "room",
    label: "Rooms",
    description: "Single rooms",
    icon: BedSingle,
  },
  {
    value: "flat",
    label: "Flats",
    description: "Everyday rentals",
    icon: Building2,
  },
  {
    value: "apartment",
    label: "Apartments",
    description: "Modern spaces",
    icon: Landmark,
  },
  {
    value: "house",
    label: "Houses",
    description: "Whole homes",
    icon: House,
  },
  {
    value: "land",
    label: "Land",
    description: "Open plots",
    icon: Trees,
  },
  {
    value: "shop",
    label: "Shops & offices",
    description: "Work spaces",
    icon: Store,
  },
];

export default function PropertyTypeStrip() {
  const navigate = useNavigate();

  function openType(type) {
    navigate("/browse", {
      state: {
        homeFilters: {
          type,
        },
      },
    });
  }

  return (
    <div
      className="
        border-t
        border-[#deddd8]
        bg-[#efeee9]
        px-4
        py-4

        dark:border-white/[0.09]
        dark:bg-[#17191c]

        sm:px-6
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-[1120px]
          grid-cols-2
          gap-2.5

          sm:grid-cols-3
          lg:grid-cols-6
        "
      >
        {TYPES.map((type) => {
          const Icon = type.icon;

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => openType(type.value)}
              className="
                group
                flex
                min-w-0
                items-center
                gap-3
                rounded-[14px]
                border
                border-[#d8d7d2]
                bg-[#faf9f6]
                px-3
                py-3
                text-left

                shadow-[0_1px_2px_rgba(15,18,20,0.04)]

                transition-[background-color,border-color,box-shadow]
                duration-200

                hover:border-[#b8b8b3]
                hover:bg-white
                hover:shadow-[0_4px_14px_rgba(15,18,20,0.07)]

                dark:border-[#35383c]
                dark:bg-[#222529]
                dark:shadow-none

                dark:hover:border-[#4b5055]
                dark:hover:bg-[#282c30]
              "
            >
              {/* ICON */}

              <span
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-[10px]

                  border
                  border-[#d5ddd9]
                  bg-[#e9efec]
                  text-[#35675f]

                  transition-colors
                  duration-200

                  group-hover:border-[#bdcec8]
                  group-hover:bg-[#e1eae6]

                  dark:border-[#3b4a47]
                  dark:bg-[#293330]
                  dark:text-[#91b9af]

                  dark:group-hover:border-[#52645f]
                  dark:group-hover:bg-[#303c38]
                "
              >
                <Icon size={16} strokeWidth={1.9} />
              </span>

              {/* TEXT */}

              <span className="min-w-0">
                <span
                  className="
                    block
                    truncate
                    text-[12px]
                    font-semibold
                    leading-4
                    text-[#1d2023]

                    dark:text-[#f1f0ec]
                  "
                >
                  {type.label}
                </span>

                <span
                  className="
                    mt-0.5
                    block
                    truncate
                    text-[9px]
                    font-medium
                    leading-3.5
                    text-[#74777a]

                    dark:text-[#a2a6aa]
                  "
                >
                  {type.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
