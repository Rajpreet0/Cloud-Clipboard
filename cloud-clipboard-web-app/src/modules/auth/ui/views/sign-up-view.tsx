"use client";

import { useRouter } from "next/navigation";
import AuthBackground from "../components/AuthBackground";
import AuthCard from "../components/AuthCard";
import AuthForm from "../components/AuthForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";


const SignUpView = () => {

  const router = useRouter();
  useAuthRedirect({ requireAuth: false, redirectTo: "/dashboard" });

  return (
    <AuthBackground>
      <AuthCard
        title="Sign Up"
        description="Create your account now"
        actionText="Have an account? Login"
        onActionClick={() => router.push("/auth/sign-in")}
        footer={null}
      >
        <AuthForm type="signup"/>
      </AuthCard>
    </AuthBackground>
  )
}

export default SignUpView