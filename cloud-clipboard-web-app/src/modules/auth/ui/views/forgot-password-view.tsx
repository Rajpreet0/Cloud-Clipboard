"use client"
import React from 'react'
import AuthBackground from '../components/AuthBackground'
import AuthCard from '../components/AuthCard'
import AuthForm from '../components/AuthForm'

const ForgotPasswordView = () => {
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