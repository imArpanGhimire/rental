export function validateNewPassword(newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
        return "New passwords don't match.";
    }
    if (newPassword.length < 6) {
        return "New password must be at least 6 characters.";
    }
    return "";
}