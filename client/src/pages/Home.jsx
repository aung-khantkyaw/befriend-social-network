import VerifyEmailPage from "@/features/auth/VerifyEmailPage";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import { authService } from "@/services/authService";

export default function Home() {
  const { user } = authService();
  const token = localStorage.getItem("token");

  const isVerified = user?.isVerified;

  return (
    <div>
      {token && user ? (
        <>{isVerified ? <AuthLayout /> : <VerifyEmailPage />}</>
      ) : (
        <MainLayout />
      )}
    </div>
  );
}
