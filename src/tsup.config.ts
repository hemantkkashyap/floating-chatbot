import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/FloatingChatbot.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
});
