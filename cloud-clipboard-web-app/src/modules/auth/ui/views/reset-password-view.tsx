"use client";

import { useRouter } from "next/navigation";
import AuthBackground from "../components/AuthBackground";
import AuthCard from "../components/AuthCard";
import AuthForm from "../components/AuthForm";
import { useAuthRedirect } from "@/hook/useAuthRedirect";

const ResetPasswordView = () => {

    const router = useRouter();
    useAuthRedirect({ requireAuth: false, redirectTo: "/dashboard" });


  return (
    <AuthBackground>
        <AuthCard
            title="Reset Password"
            description="Enter your new password below."    
        >
            <AuthForm type="resetPassword"/>
        </AuthCard>
    </AuthBackground>
  )
}

export default ResetPasswordView