import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
export default defineConfig(({ mode }) => ({

server: {
  host: "::",
  port: 8080,
  allowedHosts: [
    "5ceaf3e4-4de6-48d1-a7eb-05695776ba3d.lovableproject.com",
    // Keep this pattern to allow any subdomain of lovableproject.com
    ".lovableproject.com"
  ]
},

plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    ].filter(Boolean),
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
