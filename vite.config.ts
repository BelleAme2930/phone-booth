import { defineConfig } from "vite";
import { VitePluginFonts } from "vite-plugin-fonts";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets/v2'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  plugins: [
    react(),
    VitePluginFonts({
      google: {
        families: ["Open Sans"],
      },
    }),
    nodePolyfills({
      protocolImports: true,
    }),
   
  ],
});
