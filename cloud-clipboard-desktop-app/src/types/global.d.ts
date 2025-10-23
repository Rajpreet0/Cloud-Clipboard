export {}

type ClipItem = {
  type: "text" | "image";
  data: string;
};


declare global {
  interface Window {
    secureStore: {
      saveAuth: (tokenObj: { authToken: string; deviceId: string }) => Promise<void>;
      loadAuth: () => Promise<{ authToken: string; deviceId: string } | null>;
      clearAuth: () => Promise<void>;
    };
    clips: {
      onNew: (cb: (payload: ClipItem) => void) => (...args:any[]) => void;
      offNew: (listener: (...args:any[]) => void) => void;
    };
  }
}
