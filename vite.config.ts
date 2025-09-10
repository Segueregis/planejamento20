import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "31289348-4f34-4c47-9b31-2088a083efbf-00-1j9un6v7sn3ol.picard.replit.dev",
      "1e31e350-9163-4176-a655-68adf96638d6-00-3co9ozr6hd642.worf.replit.dev",
      "f3bd62f6-ad03-4bd9-9252-0019803dee81-00-2wgqegqb8p41z.janeway.replit.dev"
    ]
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
