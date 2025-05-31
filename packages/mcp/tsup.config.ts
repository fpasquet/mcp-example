import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/mcp-server-stdio.ts', 'src/mcp-client.ts', 'src/utils/register-mcp-server-http.ts', 'src/types.ts'],
  format: ['esm', 'cjs'],
  shims: true,
  dts: true,
  outDir: 'dist',
  splitting: false,
  clean: true,
  target: 'es2022',
  minify: true,
  onSuccess:
    'shx rm dist/types.js dist/types.cjs && shx cp -r src/resources dist/resources && shx cp -r src/db.json dist/db.json',
});
