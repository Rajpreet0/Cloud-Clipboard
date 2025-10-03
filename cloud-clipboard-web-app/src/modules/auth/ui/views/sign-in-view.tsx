"use client";
import AuthBackground from "../components/AuthBackground"
import AuthCard from "../components/AuthCard"
import AuthForm from "../components/AuthForm"


const SignInView = () => {
  return (
    <AuthBackground>
      <AuthCard
        title="Login"
        description="Welcome back! Login into your account"
        footer={null}
      >
        <AuthForm type="login"/>
      </AuthCard>
    </AuthBackground>
  )
}

export default SignInView