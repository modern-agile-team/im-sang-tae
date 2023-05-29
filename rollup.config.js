import path from "path";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import del from "rollup-plugin-delete";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  input: ["./src/index.ts"],
  output: {
    file: path.resolve(__dirname, "dist", "index.js"),
    format: "es",
    name: "im-sang-tae",
    sourcemap: true,
  },
  plugins: [del({ targets: "dist/*" }), typescript(), terser()],
};
