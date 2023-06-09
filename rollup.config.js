import path from "path";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const esmBundle = {
  input: ["./src/index.ts"],
  output: {
    file: path.resolve(__dirname, "dist", "index.js"),
    format: "es",
    name: "im-sang-tae",
    sourcemap: true,
  },
  plugins: [del({ targets: "dist/*" }), typescript(), terser()],
};

const dtsBundle = {
  input: "./src/types/index.d.ts",
  output: {
    file: path.resolve(__dirname, "dist", "types", "index.d.ts"),
    format: "es",
    sourcemap: true,
  },
  plugins: [dts()],
};

export default [esmBundle, dtsBundle];
