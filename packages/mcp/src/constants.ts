import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

function getRootDir(): string {
  const __filename = fileURLToPath(import.meta.url);
  let currentDir = dirname(__filename);
  while (!currentDir.endsWith('/dist') || currentDir.endsWith('/src')) {
    const parent = dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
  }

  return currentDir;
}

export const ROOT_DIR = getRootDir();
