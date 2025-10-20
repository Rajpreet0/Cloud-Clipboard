import { Button } from "@/components/ui/button";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full ">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={Logo} 
          alt="Cloud Clipboard Logo"
          className="w-20 h-20 mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800">
          Cloud Clipboard
        </h1>
      </div>

      {/* Welcome Message with Description */}
      <div className="flex flex-col items-center mb-8 mt-10">
        <h3 className="text-2xl font-semibold">Welcome 👋</h3>
        <p className="text-lg text-center max-w-2xl mt-4 text-gray-600">Cloud Clipboard let's you copy and paste across all your devices
          instantly, securlely and effortlessly. <span className="font-bold">One Account. One Clipboard.</span> Anywhere you go.
        </p>
      </div>

      {/* Pair Device Button */}
      <Button
        onClick={() => navigate("/pair")}
        className="w-[200px] h-[35px] mt-12 rounded-lg text-lg bg-blue text-white hover:scale-105 hover:shadow-lg transition-all cursor-pointer"
      >
        Pair Device
      </Button>

      {/* Footer Text */}
      <p className="mt-24 text-gray-600 text-sm text-center">
        No account? Please Sign Up First{" "}<br/>
        <a
          href="https://localhost:3000/auth/signup"
          target="_blank"
          className="font-semibold text-blue hover:underline mt-2"
        >
          Sign Up
        </a>
      </p>
    </div>
  )
}

export default Home