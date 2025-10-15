import { Clipboard, Settings, Users } from "lucide-react";
import Logo from "../ui/assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";


const SideMenuBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname;

    // Helper Function for active classes
    const isActive = (path: string) => currentPath === path;

  return (
      <div className="flex flex-col items-center w-[80px] p-4 bg-white-gray h-full">
        <img
            src={Logo}
            alt="Cloud Clipboard Logo"
            className="w-12 h-12"
        />
        <div className="flex flex-col h-full w-full items-center justify-center gap-8">
            <div className={`p-2 ${isActive("/dashboard") && "bg-dark-gray rounded-lg"}`}>
                <Clipboard 
                    onClick={() => navigate("/dashboard")}
                    className={`cursor-pointer ${isActive("/dashboard") ? "text-white" : "text-blue"}`} size={28} />
            </div>
            <div className={`p-2 ${isActive("/users") && "bg-dark-gray rounded-lg"}`}>
                <Users 
                    onClick={() => navigate("/users")}
                    className={`cursor-pointer ${isActive("/users") ? "text-white" : "text-blue"}`} size={28}/>
            </div>
        </div>
        <Settings className="mb-2 cursor-pointer" size={28} />
      </div>
  )
}

export default SideMenuBar
