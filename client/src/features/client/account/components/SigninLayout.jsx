import AuthLayout from "../components/AuthLayout";
import SigninForm from "./SignInForm";

export default function SigninLayout({ onClose }) {
  return (
    <AuthLayout
      title="Welcome Back"
      onClose={onClose}
    >
      <SigninForm />
    </AuthLayout>
  );
}
