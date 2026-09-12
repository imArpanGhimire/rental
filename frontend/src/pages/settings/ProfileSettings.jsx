import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Home,
  Heart,
  Settings,
  MessageSquare,
  Compass,
  PlusCircle,
  Camera,
  Trash2,
  ShieldCheck,
  UserRound,
  Eye,
  EyeOff,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import Button from "../../components/ui/Button.jsx";

import { useAuth } from "../../features/auth/AuthContext.jsx";
import {
  updateProfile,
  updatePassword,
  uploadAvatar,
  removeAvatar,
} from "../../api/auth.api.js";

/* =========================================================
   SIDEBAR LINKS
========================================================= */

const OWNER_LINKS = [
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
    to: "/owner/listings/new",
    label: "Add Listing",
    icon: PlusCircle,
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

const RENTER_LINKS = [
  {
    to: "/renter",
    label: "Overview",
    icon: Home,
    end: true,
  },
  {
    to: "/renter/saved",
    label: "Favorites",
    icon: Heart,
  },
  {
    to: "/renter/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    to: "/",
    label: "Discover",
    icon: Compass,
  },
  {
    to: "/renter/settings",
    label: "Settings",
    icon: Settings,
  },
];

/* =========================================================
   AVATAR
========================================================= */

function AvatarUploader({ user, onUploaded, onRemoved }) {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);

  const [localError, setLocalError] = useState("");

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const uploadMutation = useMutation({
    mutationFn: uploadAvatar,

    onSuccess: (data) => {
      setSelectedFile(null);
      setPreviewUrl(null);

      onUploaded(data);
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeAvatar,

    onSuccess: () => {
      onRemoved();
    },
  });

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setLocalError("Please choose an image file.");

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLocalError("Image must be under 5MB.");

      return;
    }

    setLocalError("");
    setSelectedFile(file);

    setPreviewUrl(URL.createObjectURL(file));

    event.target.value = "";
  }

  function handleCancelPreview() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setLocalError("");
  }

  function handleSave() {
    if (!selectedFile) {
      return;
    }

    uploadMutation.mutate(selectedFile);
  }

  const displaySrc = previewUrl || user?.profilePicture;

  const isBusy = uploadMutation.isPending || removeMutation.isPending;

  return (
    <div className="flex h-full flex-col">
      {/* PROFILE */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative w-fit shrink-0">
          <div
            className="
              rounded-[26px]
              border border-stone/70
              bg-ivory/55
              p-2
              shadow-[0_8px_28px_rgba(20,23,31,0.06)]
            "
          >
            {displaySrc ? (
              <img
                src={displaySrc}
                alt={user?.name || "Profile picture"}
                className="
                  h-24
                  w-24
                  rounded-[20px]
                  object-cover
                "
              />
            ) : (
              <span
                className="
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-[20px]
                  bg-gradient-to-br
                  from-[#e6e5e1]
                  via-[#cececb]
                  to-[#aaa9a6]
                  font-display
                  text-2xl
                  font-bold
                  tracking-[-0.04em]
                  text-[#25272c]
                  dark:from-[#30333a]
                  dark:via-[#23262c]
                  dark:to-[#181a1f]
                  dark:text-white/85
                "
              >
                {initials}
              </span>
            )}
          </div>

          {isBusy && (
            <div
              className="
                absolute
                inset-2
                flex
                items-center
                justify-center
                rounded-[20px]
                bg-black/45
                backdrop-blur-sm
              "
            >
              <div
                className="
                  h-5
                  w-5
                  animate-spin
                  rounded-full
                  border-2
                  border-white
                  border-t-transparent
                "
              />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p
            className="
              font-display
              text-lg
              font-semibold
              tracking-[-0.03em]
              text-text
            "
          >
            {user?.name || "Your profile"}
          </p>

          <p
            className="
              mt-1
              max-w-sm
              text-sm
              leading-6
              text-text/45
            "
          >
            Use a clear photo so your profile is easier to recognise.
          </p>
        </div>
      </div>

      {/* CONTROLS */}

      <div className="mt-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            pill
            disabled={isBusy}
            onClick={() => fileInputRef.current?.click()}
            className="
              flex
              items-center
              gap-1.5
              !px-4
              !py-2.5
              text-xs
            "
          >
            <Camera size={14} strokeWidth={1.8} />

            {user?.profilePicture ? "Change photo" : "Upload photo"}
          </Button>

          {selectedFile && (
            <>
              <Button
                type="button"
                pill
                disabled={isBusy}
                onClick={handleSave}
                className="
                  !px-4
                  !py-2.5
                  text-xs
                "
              >
                {uploadMutation.isPending ? "Saving..." : "Save photo"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                pill
                disabled={isBusy}
                onClick={handleCancelPreview}
                className="
                  !px-4
                  !py-2.5
                  text-xs
                "
              >
                Cancel
              </Button>
            </>
          )}

          {!selectedFile && user?.profilePicture && (
            <Button
              type="button"
              variant="ghost"
              pill
              disabled={isBusy}
              onClick={() => removeMutation.mutate()}
              className="
                  flex
                  items-center
                  gap-1.5
                  !px-4
                  !py-2.5
                  text-xs
                  text-red-600
                  hover:bg-red-500/[0.06]
                  hover:text-red-600
                  dark:text-red-400
                "
            >
              <Trash2 size={14} strokeWidth={1.8} />
              Remove
            </Button>
          )}
        </div>

        <p className="mt-3 text-xs text-text/35">JPG or PNG · Maximum 5MB</p>

        {localError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
            {localError}
          </p>
        )}

        {uploadMutation.isError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
            {uploadMutation.error?.message || "Couldn't upload that photo."}
          </p>
        )}

        {removeMutation.isError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
            {removeMutation.error?.message || "Couldn't remove the photo."}
          </p>
        )}

        {uploadMutation.isSuccess &&
          !uploadMutation.isPending &&
          !selectedFile && (
            <p className="mt-2 text-xs font-medium text-brass">Saved.</p>
          )}
      </div>
    </div>
  );
}

/* =========================================================
   SETTINGS-SPECIFIC INPUTS
   These use theme tokens instead of the dark-auth field styles.
========================================================= */

function SettingsField({ label, className = "", ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text/70">{label}</span>

      <input
        className={`
          h-11 w-full rounded-[13px]
          border border-stone/80 bg-bg
          px-3.5 text-[13px] text-text
          outline-none
          placeholder:text-text/30
          transition-colors
          hover:border-text/20
          focus:border-brass/60
          focus:bg-bg
          focus:shadow-[0_0_0_3px_rgba(15,122,108,0.08)]
          disabled:cursor-not-allowed
          disabled:bg-ivory/55
          disabled:text-text/45
          ${className}
        `}
        {...props}
      />
    </label>
  );
}

function SettingsPasswordInput({ label, name, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text/70">{label}</span>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          className="
            h-11 w-full rounded-[13px]
            border border-stone/80 bg-bg
            px-3.5 pr-11 text-[13px] text-text
            outline-none
            placeholder:text-text/30
            transition-colors
            hover:border-text/20
            focus:border-brass/60
            focus:bg-bg
            focus:shadow-[0_0_0_3px_rgba(15,122,108,0.08)]
          "
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="
            absolute right-1.5 top-1/2
            flex h-8 w-8 -translate-y-1/2
            items-center justify-center rounded-lg
            text-text/40 transition-colors
            hover:bg-ivory hover:text-text
          "
          aria-label={showPassword ? "Hide password" : "Show password"}
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff size={15} strokeWidth={1.8} />
          ) : (
            <Eye size={15} strokeWidth={1.8} />
          )}
        </button>
      </div>
    </label>
  );
}

/* =========================================================
   PERSONAL INFORMATION
========================================================= */

function PersonalInfoForm({ user, onSaved }) {
  const [name, setName] = useState(user?.name || "");

  const mutation = useMutation({
    mutationFn: updateProfile,

    onSuccess: (data) => {
      onSaved({
        name: data?.user?.name ?? data?.name ?? name,
      });
    },
  });

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    mutation.mutate({
      name: name.trim(),
    });
  }

  const isUnchanged = name.trim() === (user?.name || "").trim();

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex
        h-full
        flex-col
      "
    >
      <div className="grid gap-4">
        <SettingsField
          label="Full name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <SettingsField
          label="Email"
          value={user?.email || ""}
          disabled
          readOnly
        />
      </div>

      <div className="mt-4 min-h-[20px]">
        {mutation.isError && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {mutation.error?.message || "Couldn't save your changes."}
          </p>
        )}

        {mutation.isSuccess && !mutation.isPending && (
          <p className="text-xs font-medium text-brass">Changes saved.</p>
        )}
      </div>

      <div
        className="
          mt-auto
          flex
          items-center
          justify-between
          gap-4
          border-t
          border-stone/60
          pt-5
        "
      >
        <p className="hidden text-xs text-text/35 sm:block">
          Your email address cannot be changed here.
        </p>

        <Button
          type="submit"
          pill
          disabled={mutation.isPending || isUnchanged}
          className="
            !px-5
            !py-2.5
            text-xs
            sm:ml-auto
          "
        >
          {mutation.isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

/* =========================================================
   PASSWORD
========================================================= */

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [mismatchError, setMismatchError] = useState("");

  const mutation = useMutation({
    mutationFn: updatePassword,

    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
  });

  function handleSubmit(event) {
    event.preventDefault();

    setMismatchError("");

    if (newPassword !== confirmPassword) {
      setMismatchError("New passwords don't match.");

      return;
    }

    if (newPassword.length < 6) {
      setMismatchError("New password must be at least 6 characters.");

      return;
    }

    mutation.mutate({
      currentPassword,
      newPassword,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* ALL THREE FIELDS USE THE WIDTH */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-3
        "
      >
        <SettingsPasswordInput
          label="Current password"
          name="currentPassword"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          required
        />

        <SettingsPasswordInput
          label="New password"
          name="newPassword"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          required
          minLength={6}
        />

        <SettingsPasswordInput
          label="Confirm new password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          minLength={6}
        />
      </div>

      <div className="mt-4 min-h-[20px]">
        {mismatchError && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {mismatchError}
          </p>
        )}

        {mutation.isError && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {mutation.error?.message || "Couldn't update your password."}
          </p>
        )}

        {mutation.isSuccess && !mutation.isPending && (
          <p className="text-xs font-medium text-brass">Password updated.</p>
        )}
      </div>

      <div
        className="
          mt-4
          flex
          flex-col
          gap-4
          border-t
          border-stone/60
          pt-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <Link
          to="/forgot-password"
          className="
            text-xs
            font-medium
            text-text/45
            no-underline
            transition-colors
            hover:text-text
          "
        >
          Forgot your password?
        </Link>

        <Button
          type="submit"
          pill
          disabled={
            mutation.isPending ||
            !currentPassword ||
            !newPassword ||
            !confirmPassword
          }
          className="
            !px-5
            !py-2.5
            text-xs
          "
        >
          {mutation.isPending ? "Updating..." : "Update password"}
        </Button>
      </div>
    </form>
  );
}

/* =========================================================
   SETTINGS SECTION
========================================================= */

function SettingsSection({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
  className = "",
}) {
  return (
    <section
      className={`
        relative
        flex
        flex-col
        overflow-hidden
        rounded-[28px]
        border border-stone/70
        bg-bg
        shadow-[0_1px_2px_rgba(20,23,31,0.03),0_14px_40px_rgba(20,23,31,0.05)]
        ${className}
      `}
    >
      {/* SOFT BACKGROUND DETAIL */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-text/[0.025]
          blur-3xl
        "
      />

      {/* HEADER */}

      <div
        className="
          relative
          flex
          items-start
          gap-4
          border-b
          border-stone/60
          px-5
          py-5
          sm:px-6
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border border-stone/70
            bg-ivory/65
            text-text/55
          "
        >
          <Icon size={17} strokeWidth={1.8} />
        </div>

        <div>
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-text/35
            "
          >
            {eyebrow}
          </p>

          <h2
            className="
              mt-1
              font-display
              text-lg
              font-bold
              tracking-[-0.035em]
              text-text
            "
          >
            {title}
          </h2>

          {description && (
            <p
              className="
                mt-1.5
                text-sm
                leading-6
                text-text/45
              "
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* BODY */}

      <div
        className="
          relative
          flex-1
          px-5
          py-6
          sm:px-6
        "
      >
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ProfileSettings() {
  const { user, role, updateUser } = useAuth();

  const links = role === "owner" ? OWNER_LINKS : RENTER_LINKS;

  return (
    <AppShell sidebar={<Sidebar links={links} />} centeredContent>
      <div
        className="
          mx-auto
          w-full
          max-w-[1280px]
        "
      >
        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[30px]
            border border-stone/70
            bg-gradient-to-br
            from-[#f4f3ef]
            via-[#e9e8e4]
            to-[#d2d2cf]
            px-6
            py-7
            shadow-[0_16px_45px_rgba(20,23,31,0.06)]
            sm:px-8
            sm:py-8
            dark:from-[#202329]
            dark:via-[#191c21]
            dark:to-[#121419]
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-24
              h-72
              w-72
              rounded-full
              bg-white/40
              blur-[90px]
              dark:bg-white/[0.025]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              left-1/3
              h-48
              w-72
              rounded-full
              bg-black/[0.04]
              blur-[80px]
              dark:bg-black/20
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-6
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-text/40
                "
              >
                Account settings
              </p>

              <h1
                className="
                  mt-2
                  font-display
                  text-3xl
                  font-bold
                  tracking-[-0.045em]
                  text-text
                  sm:text-[38px]
                "
              >
                Personal information
              </h1>

              <p
                className="
                  mt-3
                  max-w-xl
                  text-sm
                  leading-6
                  text-text/55
                "
              >
                Manage your identity, profile photo and account security from
                one place.
              </p>
            </div>

            <div
              className="
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                border border-white/35
                bg-white/30
                px-4
                py-2
                text-xs
                font-medium
                text-text/55
                backdrop-blur-md
                dark:border-white/[0.06]
                dark:bg-white/[0.04]
              "
            >
              <Settings size={14} strokeWidth={1.8} />

              {role === "owner" ? "Owner account" : "Renter account"}
            </div>
          </div>
        </section>

        {/* =================================================
            SETTINGS GRID

            Desktop:
            ┌──────────────┬──────────────┐
            │   Profile    │ Personal info│
            ├──────────────┴──────────────┤
            │          Password           │
            └─────────────────────────────┘
        ================================================= */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-2
          "
        >
          {/* PROFILE PICTURE */}

          <SettingsSection
            eyebrow="Identity"
            title="Profile picture"
            description="This photo appears alongside your account across Rentora."
            icon={Camera}
            className="h-full"
          >
            <AvatarUploader
              user={user}
              onUploaded={(data) =>
                updateUser({
                  profilePicture: data?.user?.profilePicture,
                })
              }
              onRemoved={() =>
                updateUser({
                  profilePicture: null,
                })
              }
            />
          </SettingsSection>

          {/* PERSONAL INFORMATION */}

          <SettingsSection
            eyebrow="Account"
            title="Personal information"
            description="Keep your basic account information accurate and up to date."
            icon={UserRound}
            className="h-full"
          >
            <PersonalInfoForm user={user} onSaved={updateUser} />
          </SettingsSection>

          {/* PASSWORD — FULL WIDTH */}

          <SettingsSection
            eyebrow="Security"
            title="Password & security"
            description="Choose a strong password that you don't use elsewhere."
            icon={ShieldCheck}
            className="lg:col-span-2"
          >
            <PasswordForm />
          </SettingsSection>
        </div>
      </div>
    </AppShell>
  );
}
