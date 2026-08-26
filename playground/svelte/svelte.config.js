import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// svelte-check needs this to know how to read `lang="ts"` blocks; the Vite
// plugin picks up its own preprocessing from the same file.
export default {
  preprocess: vitePreprocess(),
}
