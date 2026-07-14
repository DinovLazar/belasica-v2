import { defineCliConfig } from "sanity/cli";

// Read env directly (not via src/sanity/env, which throws on missing values) so
// the CLI can run `login` / `init` before the project id exists.
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
