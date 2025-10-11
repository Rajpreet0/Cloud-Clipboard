"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export default function RootClient({children}: { children: React.ReactNode}) {
    const initSession = useAuthStore((s) => s.initSession);

    useEffect(() => {
        initSession();
    }, [initSession]);

    return <>{children}</>;
}