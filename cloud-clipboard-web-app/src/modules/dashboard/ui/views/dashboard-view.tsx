"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useAuthStore } from "@/store/useAuthStore";
import { Copy, Laptop } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 ** DashboardView component
 *
 * - Protects the dashboard route using `useAuthRedirect(requireAuth: true)`.
 * - Automatically syncs the authenticated user with the database via `saveUserToDB()`.
 * - Displays a loading spinner while syncing or fetching auth state.
 * - Handles and displays any sync errors gracefully.
 *
 * @returns {JSX.Element} The main dashboard view with user sync logic and loading states.
 */
const DashboardView = () => {
    const session = useAuthStore((s) => s.session);
    const loading = useAuthStore((s) => s.loading);

    const [clips, setClips] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);
    
    // Redirect unauthenticated users to sign-in
    useAuthRedirect({ requireAuth: true });

    useEffect(() => {
      const fetchClips = async () => {
        if (!session?.user?.id) return;

        try {
          const res = await fetch(`/api/clips?userId=${session.user.id}`);
          const data = await res.json();
          setClips(data);
        } catch (err) {
          console.error("Failed to load clips:", err);
          toast.error("Cloud not load your clips.");
        } finally {
          setFetching(false);
        }
      };

      fetchClips();
    }, [session]);


    const handleCopy = async (clip: any) => {
      try {
        if (clip.type === "IMAGE") {
          const blob = await fetch(`data:image/png;base64,${clip.content}`).then((r) => 
            r.blob()
          );
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/png": blob,
            }),
          ]);
        } else {
          await navigator.clipboard.writeText(clip.content);
        }

        toast.success("Copied to Clipboard");
      } catch (err) {
        console.error("Copy failed", err);
        toast.error("Failed to copy clip");
      }
    };

    if (loading || fetching) {
        return (
        <div className="flex items-center justify-center min-h-screen gap-4 bg-gray-50">
            <Spinner/> 
            <p className="text-gray-600 text-lg">
              Loading your clips...
            </p>
        </div>
        );
    }

    if (!clips.length) {
      return (
        <div className="flex items-center justify-center min-h-screen flex-col text-gray-500">
          <p className="text-lg">No clips synced yet ✨</p>
          <p className="text-sm mt-2">Copy something on your desktop app to sync it here.</p>
        </div>
      );
    }

 
  return (
    <div className="p-6 bg-muted min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Your Cloud Clips</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clips.map((clip) => (
          <div
            key={clip.id}
            className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all p-4 relative group"
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all">
              <Copy
                size={18}
                onClick={() => handleCopy(clip)}
                className="text-gray-500 hover:text-blue-600 cursor-pointer"
              />
            </div>

            {/* Clip Content */}
            <div className="space-y-3">
              {clip.type === "TEXT" && (
                <p className="text-gray-800 text-sm whitespace-pre-wrap break-words line-clamp-6">
                  {clip.content}
                </p>
              )}

              {clip.type === "IMAGE" && (
                <img
                  src={`data:image/png;base64,${clip.content}`}
                  alt="Clipboard Image"
                  className="w-full rounded-lg object-cover max-h-60"
                />
              )}

              {clip.type === "CODE" && (
                <pre className="bg-gray-100 text-xs p-3 rounded-lg overflow-x-auto">
                  <code>{clip.content}</code>
                </pre>
              )}
            </div>

            {/* Footer Info */}
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Laptop size={12} />
                {clip.deviceId || "Unknown Device"}
              </span>
              <span>
                {new Date(clip.createdAt).toLocaleString(undefined, {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardView