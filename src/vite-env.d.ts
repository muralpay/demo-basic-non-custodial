/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MURAL_API_KEY?: string;
  readonly VITE_MURAL_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}