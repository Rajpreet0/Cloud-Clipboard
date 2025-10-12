import { Button } from "@/components/ui/button";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center  w-full ">
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

      {/* Pair Device Button */}
      <Button
        onClick={() => navigate("/pair")}
        className="px-6 py-3 mt-12 rounded-xl text-blackfont-medium !bg-blue-600 text-white  transition"
      >
        Pair Device
      </Button>

      {/* Footer Text */}
      <p className="mt-24 text-gray-600 text-sm">
        No account?{" "}
        <a
          href="https://localhost:3000/auth/signup"
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          Sign Up
        </a>
      </p>
    </div>
  )
}

export default Home