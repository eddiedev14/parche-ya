import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy(), tailwindcss()],
  //? Lee el alias @/ de tsconfig.json (paths), así hay una sola fuente
  resolve: { tsconfigPaths: true },
});
