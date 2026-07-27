import AuthLayout from "../../components/layout/AuthLayout.jsx";
import LoginForm from "../../features/auth/components/LoginForm.jsx";

export default function Login() {
  return (
    <AuthLayout
      title="Welcome back to Rentora"
      subtitle="Log in to manage your listings or find your next home."
      topLinkLabel="Don't have an account?"
      topLinkText="Sign Up"
      topLinkTo="/register"
    >
      <LoginForm />
    </AuthLayout>
  );
}
