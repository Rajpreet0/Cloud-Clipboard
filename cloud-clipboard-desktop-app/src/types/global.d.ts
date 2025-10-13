export {}

declare global {
  interface Window {
    secureStore: {
      saveAuth: (tokenObj: { authToken: string; deviceId: string }) => Promise<void>;
      loadAuth: () => Promise<{ authToken: string; deviceId: string } | null>;
      clearAuth: () => Promise<void>;
    };
  }
}
