"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftIcon } from "lucide-react";

const DashboardNavbar = () => {

    const { state, toggleSidebar, isMobile } = useSidebar();

  return (
    <div className="flex px-4 gap-x-2 items-center py-3 bg-muted">
        <Button className="size-9" variant="outline" onClick={toggleSidebar}>
            {(state === "collapsed" || isMobile) 
                ? <PanelLeftIcon className="size-4"/> 
                : <PanelLeftCloseIcon className="size-4"/>}
        </Button>
    </div>
  )
}

export default DashboardNavbar