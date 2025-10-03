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

type AuthFormType = "signup" | "login";

interface AuthFormProps {
  type: AuthFormType;
}

/*
 *  Abstract Auth Form for Login and SignUp
 */
const AuthForm: React.FC<AuthFormProps> = ({type}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const schema = type === "signup" ? signUpSchema : signInSchema;

    const form = useForm<SignUpFormValues | SignInFormValues>({
        resolver: zodResolver(schema),
        defaultValues: 
          type === "signup" 
            ? {
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            } : {
              email: "",
              password: "",
            }
    });

    const onSubmit = async (values: any) => {
       setLoading(true);

       try {
         if (type === "signup") {
          // SIGN UP WITH SUPABASE
          const { error } = await supabase.auth.signUp({
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
          
          toast.success("Account created! Please check your email to verify.");
          form.reset();
         } else {
          // LOGIN WITH SUPABASE
          const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });

          if (error) throw error;

          toast.success("Welcome back!");
          form.reset();
          router.push("/dashboard");
        }
       } catch(error: any) {
        toast.error(error.message || "Something went wrong.");
       } finally {
        setLoading(false);
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



        <Button type="submit" className="w-full bg-gray-900 text-white cursor-pointer hover:bg-gray-800 transition">
          {loading ? "Loading..." : type === "signup" ? "Sign Up" : "Login"}
        </Button>

        <Button
          type="button"
          className="w-full bg-transparent text-black border cursor-pointer border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <FcGoogle size={22} />
          {type === "signup" ? "Sign Up with Google" : "Login with Google"}
        </Button>

        <p className="text-sm text-black/50 hover:underline cursor-pointer text-center"
          onClick={() => {
            router.push(type === "signup" ? "/auth/forgot-password" : "/auth/sign-up")
          }}>
          {type === "signup" ? "Forgot Password" : "Don't have an account? Sign Up"}
        </p>
      </form>
    </Form>
  )
}

export default AuthForm