// src/utils/env.ts

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_FRONTEND_URL: string;
  // add more env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL as string;
