import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  build: {
    target: "ES2022",
  },
  optimizeDeps: {
    include: ["prop-types"],
  },
});
