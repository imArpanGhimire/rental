import AuthLayout from "../../components/layout/AuthLayout.jsx";

// Placeholder — backend has no reset-password route yet (README's Future Improvements).
export default function ForgetPassword() {
  return (
    <AuthLayout
      title="Reset password"
      subtitle="This isn't available yet — check back soon."
      topLinkLabel="Remembered it?"
      topLinkText="Back to login"
      topLinkTo="/login"
    >
      <p className="text-center text-sm text-ink/60">
        Password reset isn't wired up on the backend yet.
      </p>
    </AuthLayout>
  );
}
