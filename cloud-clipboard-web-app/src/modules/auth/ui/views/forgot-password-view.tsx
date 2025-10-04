"use client"
import AuthBackground from '../components/AuthBackground'
import AuthCard from '../components/AuthCard'
import AuthForm from '../components/AuthForm'
import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hook/useAuthRedirect'

const ForgotPasswordView = () => {

  
    const router = useRouter();
    useAuthRedirect({ requireAuth: false, redirectTo: "/dashboard" });

  return (
    <AuthBackground>
        <AuthCard
            title='Forgot Password'
            description='Enter your email to recieve a reset link'>
                <AuthForm  type='forgotPassword'/>
        </AuthCard>
    </AuthBackground>
  )
}

export default ForgotPasswordView