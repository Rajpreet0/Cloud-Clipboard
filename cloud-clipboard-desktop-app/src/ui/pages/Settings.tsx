import Layout from "@/components/Layout"
import { useAuth } from "@/context/AuthContext"
import { LogOut } from "lucide-react"

const Settings = () => {

  const { logout } = useAuth();  

  return (
    <Layout>
        <h2 className="text-3xl text-left font-bold tracking-wide text-gray-700">Settings</h2>
        <div className="flex flex-col mt-4 p-4 w-full">
            <div className="flex items-center justify-between w-full">
                <div className="text-left">
                    <h3 className="text-xl font-semibold">Logout</h3>
                    <p className="text-md text-gray-400">To change Account or to renew the pairing please Logout.</p>
                </div>
                <LogOut onClick={logout} className="text-red-500 cursor-pointer"/>
            </div>
            <hr className="mt-6 border"/>
        </div>
    </Layout>
  )
}

export default Settings