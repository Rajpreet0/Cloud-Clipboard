"use client";
import GeneratedAvatar from "@/components/generated-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { getDisplayName } from "@/lib/getDisplayName";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { ChevronDownIcon, LogOutIcon, Settings } from "lucide-react";
import { useRouter } from "next/navigation"


const DashboardUserButton = () => {

    const router = useRouter();
    const isMobile = useIsMobile();
    const session = useAuthStore((s) => s.session);

    if (!session?.user) {
        return null;
    }

    const user = session.user;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    }

    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                    {user.user_metadata.avatar_url ? (
                        <Avatar>
                            <AvatarImage
                                src={user.user_metadata.avatar_url}
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                                className="object-cover"
                            />
                        </Avatar>
                    ) : (
                        <GeneratedAvatar
                            seed={getDisplayName(user)}
                            variant="botttsNeutral"
                            className="size-9 mr-3"
                        />
                    )}
                    <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                        <p className="text-sm truncate w-full">
                            {getDisplayName(user)}
                        </p>
                        <p className="text-xs truncate w-full">
                            {user.email}
                        </p>
                    </div>
                    <ChevronDownIcon className="size-4 shrink-0"/>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{getDisplayName(user)}</DrawerTitle>
                        <DrawerDescription>{user.email}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/settings")}>
                                <Settings className="size-4"/>
                                Settings 
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleLogout}>
                                <LogOutIcon className="size-4 text-black"/>
                                Logout 
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }
    
  return (
    <DropdownMenu>
        <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2 cursor-pointer">
            {user.user_metadata.avatar_url ? (
                <Avatar>
                    <AvatarImage
                        src={user.user_metadata.avatar_url}
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        className="object-cover"
                    />
                </Avatar>
            ) : (
                <GeneratedAvatar
                    seed={getDisplayName(user)}
                    variant="botttsNeutral"
                    className="size-9 mr-3"
                />
            )}
            <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                <p className="text-sm truncate w-full">
                    {getDisplayName(user)}
                </p>
                <p className="text-xs truncate w-full">
                    {user.email}
                </p>
            </div>
            <ChevronDownIcon className="size-4 shrink-0"/>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right" className="w-72">
            <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                    <span className="font-medium truncate">                    
                        {getDisplayName(user)}
                    </span>
                    <span>
                        {user.email}
                    </span>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem 
                onClick={() => router.push("/settings")}
                className="cursor-pointer flex items-center justify-between">
                Settings <Settings className="size-4"/>
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer flex items-center justify-between"
            >
                Logout <LogOutIcon className="size-4"/>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DashboardUserButton