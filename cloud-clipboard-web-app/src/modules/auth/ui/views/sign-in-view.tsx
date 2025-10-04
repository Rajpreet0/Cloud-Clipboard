"use client";
import { useRouter } from "next/navigation";
import AuthBackground from "../components/AuthBackground"
import AuthCard from "../components/AuthCard"
import AuthForm from "../components/AuthForm"
import { useAuthRedirect } from "@/hook/useAuthRedirect";


const SignInView = () => {

  const router = useRouter();
  useAuthRedirect({ requireAuth: false, redirectTo: "/dashboard" });

  return (
    <AuthBackground>
      <AuthCard
        title="Login"
        description="Welcome back! Login into your account"
        actionText="No account? Sign Up"
        onActionClick={() => router.push("/auth/sign-up")}
        footer={null}
      >
        <AuthForm type="login"/>
      </AuthCard>
    </AuthBackground>
  )
}

export default SignInView