function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.9 5.1 29.7 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.6 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.9 5.1 29.7 3 24 3 16 3 9.1 7.5 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 45c5.6 0 10.6-1.9 14.5-5.2l-6.7-5.7C29.7 35.7 27 36.5 24 36.5c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9 40.4 15.9 45 24 45z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.7 5.7C41.4 36.4 44 30.7 44 24c0-1.2-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 0 184.8 0 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 37.5 59 129.3 107.2 127.7 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-84.2 102.6-121.8-65.2-30.7-57.7-90-57.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
    </svg>
  );
}

export default function OAuthButtons() {
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => console.log("Google OAuth not yet connected")}
        className="flex items-center justify-center gap-3 border border-stone rounded-xl py-2.5 text-sm text-ink hover:border-brass transition-colors bg-white"
      >
        <GoogleIcon />
        Continue with Google
      </button>
      <button
        type="button"
        onClick={() => console.log("Apple OAuth not yet connected")}
        className="flex items-center justify-center gap-3 border border-stone rounded-xl py-2.5 text-sm text-ink hover:border-brass transition-colors bg-white"
      >
        <AppleIcon />
        Continue with Apple
      </button>
    </div>
  );
}
