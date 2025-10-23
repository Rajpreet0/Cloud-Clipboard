import Layout from "@/components/Layout"
import SettingsItem from "@/components/SettingsItem";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext"

const Settings = () => {

  const { logout, auth } = useAuth();  

  return (
    <Layout>
        <h2 className="text-3xl text-left font-bold tracking-wide text-gray-700">Settings</h2>
        <div className="flex flex-col mt-4 p-4 w-full gap-10">
            {/*TODO: Hardcoded email should be available */}
            <div>
              <h2 className="font-semibold text-lg text-gray-600">Account</h2>
              <SettingsItem
                itemTitle={auth?.user.email ?? "Loading..."}
                children={
                  <>
                    <Button onClick={logout} className="text-white cursor-pointer bg-red-700">Logout</Button>
                  </>
                }
              />
            </div>
            <div>
                <h2 className="font-semibold text-lg text-gray-600">Cloud Sync</h2>
                <SettingsItem
                  itemTitle="Synchronization"
                  children={
                    <>
                    
                    </>
                  }/>
                <SettingsItem
                  itemTitle="Sync Frequency"
                  children={
                    <>
                    
                    </>
                }/>
            </div>
            <div>
                <h2 className="font-semibold text-lg text-gray-600">Shortcuts</h2>
                <SettingsItem
                  itemTitle="Open Clipboard Overlay"
                  children={
                    <>
                    
                    </>
                  }/>
                <SettingsItem
                  itemTitle="Copy Last Clip"
                  children={
                    <>
                    
                    </>
                }/>
                <SettingsItem
                  itemTitle="Pause Sync"
                  children={
                    <>
                    
                    </>
                }/>
            </div>
            <div>
                <h2 className="font-semibold text-lg text-gray-600">About</h2>
                <p className="text-md text-gray-500">Version 0.0.1</p>
            </div>
        </div>
        <div className="flex flex-row w-full items-center justify-center gap-4 text-sm text-blue-500 mt-4">
              <a
                href="#" 
                className="cursor-pointer">Privacy Policy</a>
              <a
                href="#"
                className="cursor-pointer">Webseite</a>
              <a
                href="#"
                className="cursor-pointer">Github</a>
        </div>
    </Layout>
  )
}

export default Settings