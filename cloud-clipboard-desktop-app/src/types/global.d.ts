export {}

type ClipItem = {
  type: "text" | "image";
  data: string;
};

type DeviceInfo = {
  os: string;
  browser: string;
  deviceType: string;
  fingerprint: string;
};

type StoredAuth = {
  authToken: string;
  deviceId: string;
  deviceInfo?: DeviceInfo; 
  user?: {
    id: string;
    email: string;
    fullName?: string | null;
  };
};

declare global {
  interface Window {
    secureStore: {
      saveAuth: (tokenObj: StoredAuth) => Promise<void>;
      loadAuth: () => Promise<StoredAuth | null>;
      clearAuth: () => Promise<void>;
    };
    clips: {
      onNew: (cb: (payload: ClipItem) => void) => (...args:any[]) => void;
      offNew: (listener: (...args:any[]) => void) => void;
    };
  }
}
