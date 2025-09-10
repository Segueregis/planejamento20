import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
 server: {
  host: "::",
  port: 8080,
  allowedHosts: [
    "31289348-4f34-4c47-9b31-2088a083efbf-00-1j9un6v7sn3ol.picard.replit.dev"
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
