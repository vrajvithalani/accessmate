declare global {
  interface CloudflareEnv {
    GEMINI_API_KEY: string;
    GROQ_API_KEY: string;
    BROWSER: Fetcher;
    KV: KVNamespace;
  }
}
export {};
