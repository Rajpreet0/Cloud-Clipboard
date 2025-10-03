import { ReactNode } from "react";
import BackgroundImage from "../../../../../public/images/auth-background.png";


const AuthBackground = ({children}: {children: ReactNode}) => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: `url(${BackgroundImage.src})` }}
    >
      <div className="relative z-10 w-full px-4 sm:px-8 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export default AuthBackground