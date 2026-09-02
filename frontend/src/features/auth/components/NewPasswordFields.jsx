import PasswordInput from "../../../components/ui/PasswordInput";

export default function NewPasswordFields({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
}) {
  return (
    <>
      <PasswordInput
        label="New password"
        name="newPassword"
        value={newPassword}
        onChange={(e) => onNewPasswordChange(e.target.value)}
        required
        minLength={6}
      />

      <PasswordInput
        label="Confirm new password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        required
        minLength={6}
      />
    </>
  );
}
