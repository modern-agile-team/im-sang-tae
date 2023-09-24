import path from "path";
import terser from "@rollup/plugin-terser";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";
import { babel } from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

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
  plugins: [
    del({ targets: "dist/*" }),
    commonjs(),
    nodeResolve(),
    terser(),
    typescript({ useTsconfigDeclarationDir: true, tsconfig: "./tsconfig.json" }),
    babel({
      babelHelpers: "bundled",
      include: "src/**/*.(ts|tsx|js|jsx)",
      extensions: [".ts", ".tsx", ".js", ".jsx", ".es", ".es6", ".mjs"],
    }),
  ],
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
