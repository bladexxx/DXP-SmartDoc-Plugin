/// <reference types="vite/client" />

// FIX: Replaced 'declare var process' with namespace merging for 'NodeJS.ProcessEnv'
// to resolve a redeclaration error with global Node.js types. This correctly
// extends the types for `process.env` to provide type safety and autocompletion
// for the custom environment variables used in the application.
declare namespace NodeJS {
  interface ProcessEnv {
    // This variable is provided by the execution environment (e.g., in the cloud run instance), not by Vite's define config.
    API_KEY: string;

    // These variables are injected by Vite's `define` config in `vite.config.ts`.
    VITE_AI_PROVIDER: 'GEMINI' | 'GATEWAY';
    VITE_AI_GATEWAY_URL: string;
    VITE_AI_GATEWAY_API_KEY: string;
    VITE_AI_GATEWAY_MODEL: string;
  }
}
