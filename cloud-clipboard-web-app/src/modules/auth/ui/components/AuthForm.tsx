import { useForm } from "react-hook-form"
import { SignUpFormValues, signUpSchema } from "../../schemas/sign-up-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { SignInFormValues, signInSchema } from "../../schemas/sign-in-schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "../../schemas/forgot-password-schema";
import { resetPasswordSchema, ResetPasswordValues } from "../../schemas/reset-password-schema";
import { Spinner } from "@/components/ui/spinner";
import { registerDevice } from "@/lib/registerDevice";
import { useAuthStore } from "@/store/useAuthStore";

type AuthFormType = "signup" | "login" | "forgotPassword" | "resetPassword";

interface AuthFormProps {
  type: AuthFormType;
}

/*
 *  Abstract Auth Form for Login and SignUp
 */
const AuthForm: React.FC<AuthFormProps> = ({type}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const { setSession } = useAuthStore.getState();
 
    let schema;
    let defaultValues: any;

    if (type === "signup") {
      schema = signUpSchema;
      defaultValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      };
    } else if (type === "login") {
      schema = signInSchema;
      defaultValues = {
        email: "",
        password: "",
      };
    } else if (type === "forgotPassword") {
      schema = forgotPasswordSchema;
      defaultValues = {
        email: "",
      };
    } else {
      schema = resetPasswordSchema;
      defaultValues = {
        password: "",
        confirmPassword: "",
      }
    }

    const form = useForm<SignUpFormValues | SignInFormValues | ForgotPasswordFormValues | ResetPasswordValues>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const onSubmit = async (values: any) => {
       setLoading(true);

       try {
         if (type === "signup") {
          // SIGN UP WITH SUPABASE
          const { data, error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
              data: {
                username: values.username,
              },
              emailRedirectTo: `${window.location.origin}/dashboard`
            },
          });

          if (error) throw error;

          setSession(data.session);
          
          const userId  = data.session?.user?.id;
          if (userId) await registerDevice(userId);
          
          toast.success("Account created! Please check your email to verify.");
          form.reset();
         } else if (type === "login") {
          // LOGIN WITH SUPABASE
          const { data, error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });

          if (error) throw error;

          setSession(data.session);

          const userId = data.session?.user?.id;
          if (userId) await registerDevice(userId);

          toast.success("Welcome back!");
          form.reset();
          router.push("/dashboard");
        } else if (type === "forgotPassword") {
          const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          });

          if (error) throw error;
          toast.success("Password reset link sent! Please check your email.");
          form.reset();
        } else if (type === "resetPassword") {
          const { error } = await supabase.auth.updateUser({
            password: values.password,
          });

          if (error) throw error;
          toast.success("Password updated successfully!");
          router.push("/auth/sign-in");
        }
       } catch(error: any) {
        toast.error(error.message || "Something went wrong.");
       } finally {
        setLoading(false);
       }
    }

    const handleGoogleAuth = async () => {
      try {
        setGoogleLoading(true);

        const {  error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;
      } catch (error: any) {
        toast.error(error.message || "Google sign-in failed.");
      } finally {
        setGoogleLoading(false);
      }
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {type === "signup" && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. kawaii_user" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type !== "resetPassword" && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type !== "forgotPassword" && type !== "resetPassword" && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === "signup" && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === "resetPassword" && (
          <>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}



        <Button type="submit" className="w-full bg-gray-900 text-white cursor-pointer hover:bg-gray-800 transition">
          {loading 
            ? 
            <div className="flex items-center gap-4">
              <Spinner/>
              <p>Loading...</p>
            </div>
            : type === "signup" 
            ? "Sign Up" 
            : type === "login" 
            ? "Login" 
            : type === "forgotPassword" 
            ? "Send Reset Link" 
            : "Update Password"}
        </Button>

        {type !== "forgotPassword" && type !== "resetPassword" && (
          <Button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading || googleLoading}
            className="w-full bg-transparent text-black border cursor-pointer border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <FcGoogle size={22} />
            {googleLoading 
              ?             
              <div className="flex items-center gap-4">
                <Spinner/>
                <p>Loading...</p>
              </div>
              : type === "signup" 
              ? "Sign Up with Google" 
              : "Sign in with Google"}
          </Button>
        )}

        {type !== "resetPassword" && (
          <p className="text-sm text-black/50 hover:underline cursor-pointer text-center"
            onClick={() => {
              router.push(type === "forgotPassword" ? "/auth/sign-in" : "/auth/forgot-password")
            }}>
            {type === "forgotPassword" ? "Back to Login" : "Forgot Password"}
          </p>
        )}
      </form>
    </Form>
  )
}

export default AuthForm