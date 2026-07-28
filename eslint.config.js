import js from "@eslint/js";
import tseslint from "typescript-eslint";

// Deliberately thin. The scratch repo's own rules must never be the reason a
// run fails ambiguously; the interesting gate is scripts/no-todo-lint.mjs.
export default tseslint.config(
  { ignores: ["**/dist/**", "**/node_modules/**", "**/.turbo/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { process: "readonly" },
    },
  },
);
