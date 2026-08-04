import AuthLayout from "../../components/layout/AuthLayout.jsx";
import RegisterForm from "../../features/auth/components/RegisterForm.jsx";

export default function Register() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Find your next place, or list one"
      topLinkLabel="Already have an account?"
      topLinkText="Log in"
      topLinkTo="/login"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
