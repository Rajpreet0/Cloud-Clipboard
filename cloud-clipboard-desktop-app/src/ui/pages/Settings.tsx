import Layout from "@/components/Layout"
import SettingsItem from "@/components/SettingsItem";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext"
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

const Settings = () => {

  const { logout, auth } = useAuth();  
  const [syncFrequency, setSyncFrequency] = useState("Open");

  return (
    <Layout>
        <h2 className="text-3xl text-left font-bold tracking-wide text-gray-700">Settings</h2>
        <div className="flex flex-col mt-4 p-4 w-full gap-10"> 
            <div>
              <h2 className="font-semibold text-lg text-gray-600">Account</h2>
              <SettingsItem itemTitle={auth?.user.email ?? "Loading..."} >
                <Button onClick={logout} className="text-white cursor-pointer bg-red-700">Logout</Button>
              </SettingsItem>
              {/* CLOUD STORAGE USASGE BAR */}
              <div className="w-full bg-gray-300  mt-4 rounded">
                <div className={`w-[24%] bg-blue p-1 rounded`}></div>
              </div>
              <p className="mt-1 text-xs text-gray-500">24 MB / 100 MB Clips stored </p>
            </div>
            <div>
                <h2 className="font-semibold text-lg text-gray-600">Cloud Sync</h2>
                <SettingsItem itemTitle="Synchronization">
                    <>  
                      {/* CLOUD SYNC SWITCH */}
                      <Switch className="cursor-pointer"/>
                    </>
                </SettingsItem>
                <SettingsItem itemTitle="Sync Frequency">
                     {/* SYNC FREQUENCY DROPDOWN */}
                     <DropdownMenu>
                      <DropdownMenuTrigger className="bg-gray-200 p-2 min-w-[100px] rounded cursor-pointer">
                        <div className="w-full flex items-center justify-around">
                          <p className="text-sm text-gray-500 font-semibold">{syncFrequency}</p>
                          <div>
                            <ChevronsUpDown size={16} className="text-gray-500 ml-2"/>
                          </div>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {["Real-Time", "30 Seconds", "2 Minutes", "10 Minutes"].map((item) => (
                          <DropdownMenuItem
                            key={item}
                            onClick={() => setSyncFrequency(item)}>
                            {item}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                     </DropdownMenu>
                </SettingsItem>
            </div>
            <div>
                <h2 className="font-semibold text-lg text-gray-600">Shortcuts</h2>
                <SettingsItem itemTitle="Open Clipboard Overlay">
                    {/* SHORTCUT OPEN CLIPBOARD OVERLAY */} 
                    <KbdGroup>
                      <Kbd>⌘</Kbd>
                      <span className="text-gray-500">+</span>
                      <Kbd>⇧</Kbd>
                      <span className="text-gray-500">+</span>
                      <Kbd>O</Kbd>
                    </KbdGroup>
                </SettingsItem>
                <SettingsItem itemTitle="Copy Last Clip">
                    {/* SHORTCUT COPY LAST CLIP */}
                    <KbdGroup>
                      <Kbd>⌘</Kbd>
                      <span className="text-gray-500">+</span>
                      <Kbd>⇧</Kbd>
                      <span className="text-gray-500">+</span>
                      <Kbd>C</Kbd>
                    </KbdGroup>
                </SettingsItem>
                <SettingsItem itemTitle="Pause Sync">
                    {/* SHORTCUT PAUSE SYNC */}
                    <KbdGroup>
                      <Kbd>⌘</Kbd>
                      <span className="text-gray-500">+</span>
                      <Kbd>⇧</Kbd>
                      <span className="text-gray-500">+</span>
                      <Kbd>P</Kbd>
                    </KbdGroup>
                </SettingsItem>
                <SettingsItem itemTitle="Restart Sync">
                    {/* SHORTCUT PAUSE SYNC */}
                    <KbdGroup>
                      <Kbd>⌘</Kbd>
                      <span className="text-gray-500">+</span>
                      <Kbd>⇧</Kbd>
                      <span className="text-gray-500">+</span>
                      <Kbd>S</Kbd>
                    </KbdGroup>
                </SettingsItem>                 
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
                className="cursor-pointer">Website</a>
              <a
                href="#"
                className="cursor-pointer">Github</a>
        </div>
    </Layout>
  )
}

export default Settings