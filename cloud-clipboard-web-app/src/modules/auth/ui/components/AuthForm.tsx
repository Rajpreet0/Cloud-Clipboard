import { useForm } from "react-hook-form"
import { SignUpFormValues, signUpSchema } from "../../schemas/sign-up-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { SignInFormValues, signInSchema } from "../../schemas/sign-in-schema";
import { useRouter } from "next/navigation";

type AuthFormType = "signup" | "login";

interface AuthFormProps {
  type: AuthFormType;
}


const AuthForm: React.FC<AuthFormProps> = ({type}) => {
    const router = useRouter();
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

    const onSubmit = (values: any) => {
        console.log(`${type.toUpperCase()} values:`, values);
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
          {type === "signup" ? "Sign Up" : "Login"}
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