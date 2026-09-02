export function validateNewPassword(newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
        return "Make sure the new password are matching";
    }
    if (newPassword.length < 6) {
        return "New password must be at least 6 characters.";
    }
    return "";
}