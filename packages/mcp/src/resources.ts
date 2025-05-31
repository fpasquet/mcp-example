import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { ROOT_DIR } from './constants.js';

export const RESOURCES = [
  {
    name: 'rules.md',
    description: 'Document complet des règles et mécaniques du système planétaire',
    mimeType: 'text/markdown',
    uri: 'file://rules.md',
  },
];

export const RULES = readFileSync(resolve(ROOT_DIR, './resources/rules.md'), 'utf-8');
