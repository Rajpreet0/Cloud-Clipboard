"use client";

import AuthBackground from "../components/AuthBackground";
import AuthCard from "../components/AuthCard";
import AuthForm from "../components/AuthForm";

const ResetPasswordView = () => {
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