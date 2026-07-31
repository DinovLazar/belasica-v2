import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // `**/` matters: the bare patterns only ever matched the repo root, so a
    // git worktree under `.claude/worktrees/<branch>/` carrying its own `.next`
    // was walked and parsed in full — `npm run lint` died with a V8
    // out-of-memory before reaching a single source file (3.09). Build output
    // is build output wherever it sits.
    ignores: [
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      ".claude/**",
      "_to_delete/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
