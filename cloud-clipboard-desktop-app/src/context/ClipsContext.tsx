import { createContext, useContext, useEffect, useState } from "react";


export type ClipItem = {
    type: "text" | "image" | "code";
    data: string;
    timestamp: number;
    os: string; 
    browser: string;
    deviceType: string;
}

type ClipsContextType = {
    clips: ClipItem[];
    addClip: (clip: ClipItem) => void;
    clearClips: () => void;
    removeClips?: (index: number) => void;
}

const ClipsContext = createContext<ClipsContextType>({
    clips: [],
    addClip: () => {},
    clearClips: () => {},
});


export const ClipsProvider = ({ children }: {children: React.ReactNode}) => {
    const [clips, setClips] = useState<ClipItem[]>([]);

    // localstorage
    useEffect(() => {
        const saved = localStorage.getItem("clips");
        if (saved) {
            try {
                setClips(JSON.parse(saved));
            } catch {
                console.warn("Failed to parse Clips from storage");
            }
        } 
    }, []);

    useEffect(() => {
        localStorage.setItem("clips", JSON.stringify(clips));
    }, [clips]);

    const addClip = (clip: ClipItem) => setClips((prev) => [clip, ...prev]);
    const clearClips = () => setClips([]);

    return (
        <ClipsContext.Provider value={{ clips, addClip, clearClips }}>
            {children}
        </ClipsContext.Provider>
    )
};

export const useClips = () => useContext(ClipsContext);