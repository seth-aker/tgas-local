import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // example/ is its own workspace package with its own vitest run
    include: ['test/**/*.test.ts'],
    setupFiles: ['test/setup.ts']
  },
})
