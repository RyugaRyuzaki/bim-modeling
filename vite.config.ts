import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
//@ts-ignore
export default defineConfig(() => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // eslint-disable-next-line no-undef
  const env = loadEnv("development", process.cwd(), "");
  return {
    // vite config

    plugins: [react()],
    worker: {
      plugins: [react()],
    },
    server: {
      port: env.PORT, // set port
    },
    esbuild: {
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment",
    },
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@BimModel": path.resolve(__dirname, "./src/BimModel"),
        "@CubeMapComponent": path.resolve(
          __dirname,
          "./src/BimModel/src/CubeMapComponent"
        ),
        "@MaterialComponent": path.resolve(
          __dirname,
          "./src/BimModel/src/MaterialComponent"
        ),
        "@ModelingComponent": path.resolve(
          __dirname,
          "./src/BimModel/src/ModelingComponent"
        ),
        "@PropertyComponent": path.resolve(
          __dirname,
          "./src/BimModel/src/PropertyComponent"
        ),
        "@RendererComponent": path.resolve(
          __dirname,
          "./src/BimModel/src/RendererComponent"
        ),
        "@StructureComponent": path.resolve(
          __dirname,
          "./src/BimModel/src/StructureComponent"
        ),
        "@ProjectComponent": path.resolve(
          __dirname,
          "./src/BimModel/src/ProjectComponent"
        ),
        "@system": path.resolve(__dirname, "./src/BimModel/src/system"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@signals": path.resolve(__dirname, "./src/signals"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@baseTypes": path.resolve(__dirname, "./src/baseTypes"),
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: "./",
    build: {
      outDir: "./build",
    },
    test: {
      global: true,
      environment: "jsdom",
    },
    optimizeDeps: {
      exclude: ["js-big-decimal"],
    },
  };
});
