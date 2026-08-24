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
} from "lucide-react";

import AppShell from "../../components/layout/AppShell.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import AuthField from "../../components/ui/AuthField.jsx";
import PasswordInput from "../../components/ui/PasswordInput.jsx";
import Button from "../../components/ui/Button.jsx";

import { useAuth } from "../../features/auth/AuthContext.jsx";
import {
  updateProfile,
  updatePassword,
  uploadAvatar,
  removeAvatar,
} from "../../api/auth.api.js";

/* =========================================================
   SIDEBAR LINKS — mirrors the links array in each Dashboard
   so the active-tab highlighting matches when you navigate
   here from Overview/Favorites/etc.
========================================================= */

const OWNER_LINKS = [
  { to: "/owner", label: "Overview", icon: Home, end: true },
  { to: "/owner/listings", label: "My Listings", icon: Compass },
  { to: "/owner/listings/new", label: "Add Listing", icon: PlusCircle },
  { to: "/owner/messages", label: "Messages", icon: MessageSquare },
  { to: "/owner/favorites", label: "Favorites", icon: Heart },
  { to: "/owner/settings", label: "Settings", icon: Settings },
];

const RENTER_LINKS = [
  { to: "/renter", label: "Overview", icon: Home, end: true },
  { to: "/renter/saved", label: "Favorites", icon: Heart },
  { to: "/renter/messages", label: "Messages", icon: MessageSquare },
  { to: "/", label: "Discover", icon: Compass },
  { to: "/renter/settings", label: "Settings", icon: Settings },
];

/* =========================================================
   AVATAR
========================================================= */

function AvatarUploader({ user, onUploaded, onRemoved }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [localError, setLocalError] = useState("");

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const uploadMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (data) => {
      setPreviewUrl(null);
      onUploaded(data);
    },
    onError: () => {
      setPreviewUrl(null);
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeAvatar,
    onSuccess: () => {
      onRemoved();
    },
  });

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setLocalError("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLocalError("Image must be under 5MB.");
      return;
    }

    setLocalError("");
    setPreviewUrl(URL.createObjectURL(file));
    uploadMutation.mutate(file);

    // Allow re-selecting the same file later.
    e.target.value = "";
  }

  const displaySrc = previewUrl || user?.avatarUrl;
  const isBusy = uploadMutation.isPending || removeMutation.isPending;

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0">
        {displaySrc ? (
          <img
            src={displaySrc}
            alt={user?.name || "Profile picture"}
            className="w-20 h-20 rounded-full object-cover border border-stone"
          />
        ) : (
          <span className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-ink bg-gradient-to-br from-brass-light to-brass border border-stone">
            {initials}
          </span>
        )}

        {isBusy && (
          <div className="absolute inset-0 rounded-full bg-ink/40 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-ivory border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            pill
            disabled={isBusy}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 !py-2 !px-4 text-xs"
          >
            <Camera size={14} />
            {user?.avatarUrl ? "Change photo" : "Upload photo"}
          </Button>

          {user?.avatarUrl && (
            <Button
              type="button"
              variant="ghost"
              pill
              disabled={isBusy}
              onClick={() => removeMutation.mutate()}
              className="flex items-center gap-1.5 !py-2 !px-4 text-xs text-red-600 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={14} />
              Remove
            </Button>
          )}
        </div>

        <p className="text-xs text-text/45">JPG or PNG, up to 5MB.</p>

        {localError && <p className="text-xs text-red-600">{localError}</p>}

        {uploadMutation.isError && (
          <p className="text-xs text-red-600">
            {uploadMutation.error?.message || "Couldn't upload that photo."}
          </p>
        )}

        {removeMutation.isError && (
          <p className="text-xs text-red-600">
            {removeMutation.error?.message || "Couldn't remove the photo."}
          </p>
        )}
      </div>
    </div>
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
      onSaved({ name: data?.user?.name ?? data?.name ?? name });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate({ name: name.trim() });
  }

  const isUnchanged = name.trim() === (user?.name || "").trim();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <AuthField
        label="Full name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <AuthField label="Email" value={user?.email || ""} disabled readOnly />

      {mutation.isError && (
        <p className="text-xs text-red-600">
          {mutation.error?.message || "Couldn't save your changes."}
        </p>
      )}

      {mutation.isSuccess && !mutation.isPending && (
        <p className="text-xs text-brass">Saved.</p>
      )}

      <Button
        type="submit"
        pill
        disabled={mutation.isPending || isUnchanged}
        className="self-start !py-2.5 !px-5 text-xs"
      >
        {mutation.isPending ? "Saving..." : "Save changes"}
      </Button>
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

  function handleSubmit(e) {
    e.preventDefault();
    setMismatchError("");

    if (newPassword !== confirmPassword) {
      setMismatchError("New passwords don't match.");
      return;
    }

    if (newPassword.length < 6) {
      setMismatchError("New password must be at least 6 characters.");
      return;
    }

    mutation.mutate({ currentPassword, newPassword });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <PasswordInput
        label="Current password"
        name="currentPassword"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />

      <PasswordInput
        label="New password"
        name="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        minLength={6}
      />

      <PasswordInput
        label="Confirm new password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        minLength={6}
      />

      {mismatchError && <p className="text-xs text-red-600">{mismatchError}</p>}

      {mutation.isError && (
        <p className="text-xs text-red-600">
          {mutation.error?.message || "Couldn't update your password."}
        </p>
      )}

      {mutation.isSuccess && !mutation.isPending && (
        <p className="text-xs text-brass">Password updated.</p>
      )}

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          pill
          disabled={
            mutation.isPending ||
            !currentPassword ||
            !newPassword ||
            !confirmPassword
          }
          className="!py-2.5 !px-5 text-xs"
        >
          {mutation.isPending ? "Updating..." : "Update password"}
        </Button>

        <Link
          to="/forgot-password"
          className="text-xs font-medium text-text/50 hover:text-brass transition-colors"
        >
          Forgot your password?
        </Link>
      </div>
    </form>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ProfileSettings() {
  const { user, role, updateUser } = useAuth();

  const links = role === "owner" ? OWNER_LINKS : RENTER_LINKS;

  return (
    <AppShell sidebar={<Sidebar links={links} />}>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl text-text">
            Settings
          </h1>
          <p className="text-sm text-text/50 mt-1">
            Manage your profile, photo, and password.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* PROFILE PICTURE */}
          <section className="border border-stone rounded-2xl p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-text mb-4">
              Profile picture
            </h2>

            <AvatarUploader
              user={user}
              onUploaded={(data) =>
                updateUser({ avatarUrl: data?.avatarUrl ?? data?.url })
              }
              onRemoved={() => updateUser({ avatarUrl: null })}
            />
          </section>

          {/* PERSONAL INFORMATION */}
          <section className="border border-stone rounded-2xl p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-text mb-4">
              Personal information
            </h2>

            <PersonalInfoForm user={user} onSaved={updateUser} />
          </section>

          {/* PASSWORD */}
          <section className="border border-stone rounded-2xl p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-text mb-4">Password</h2>

            <PasswordForm />
          </section>
        </div>
      </div>
    </AppShell>
  );
}
