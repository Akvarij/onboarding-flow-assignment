import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/onboarding-flow-assignment/",
  build: {
    outDir: "docs",
  },
  plugins: [react()],
});
