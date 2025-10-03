import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
  return (
    <div className="p-2">
      Cloud Clipboard SaaS Web App
      <Button className="m-4" >
        <Link href="/auth/sign-in">
          Login
        </Link>
      </Button>    
      <Button className="m-4" >
        <Link href="/auth/sign-up">
          Register
        </Link>
      </Button>
    </div>
  );
}
