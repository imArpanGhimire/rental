import AuthLayout from "../../components/layout/AuthLayout.jsx";
import RegisterForm from "../../features/auth/components/RegisterForm.jsx";

export default function Register() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Choose how you'll use Rentora, then add your account details."
      topLinkLabel="Already have an account?"
      topLinkText="Log in"
      topLinkTo="/login"
      wide
    >
      <RegisterForm />
    </AuthLayout>
  );
}
