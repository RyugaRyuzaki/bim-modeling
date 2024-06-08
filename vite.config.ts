import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";
import glsl from "vite-plugin-glsl";
// https://vitejs.dev/config/
//@ts-ignore
export default defineConfig(() => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // eslint-disable-next-line no-undef
  const env = loadEnv("development", process.cwd(), "");
  return {
    // vite config

    plugins: [
      react(),
      glsl({
        include: [
          // Glob pattern, or array of glob patterns to import
          "**/*.glsl",
          "**/*.wgsl",
          "**/*.vert",
          "**/*.frag",
          "**/*.vs",
          "**/*.fs",
        ],
        exclude: undefined, // Glob pattern, or array of glob patterns to ignore
        warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
        defaultExtension: "glsl", // Shader suffix when no extension is specified
        compress: false, // Compress output shader code
        watch: true, // Recompile shader on change
        root: "/", // Directory for root imports
      }),
      svgr({
        svgrOptions: {
          exportType: "named",
          ref: true,
          svgo: false,
          titleProp: true,
        },
        include: "**/*.svg",
      }),
    ],
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
        "@ProjectComponent": path.resolve(
          __dirname,
          "./src/BimModel/src/ProjectComponent"
        ),
        "@LevelSystem": path.resolve(
          __dirname,
          "./src/BimModel/src/LevelSystem"
        ),
        "@WorkPlane": path.resolve(__dirname, "./src/BimModel/src/WorkPlane"),
        "@DrawTool": path.resolve(__dirname, "./src/BimModel/src/DrawTool"),
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
      chunkSizeWarningLimit: false,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            // creating a chunk to @open-ish deps. Reducing the vendor chunk size
            if (id.includes("clay")) {
              return "clay.min";
            }
            if (id.includes("three")) {
              return "three.min";
            }
            if (id.includes("web-ifc")) {
              return "web-ifc.min";
            }
          },
        },
      },
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
