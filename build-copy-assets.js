import { copyFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// Ensure dist directory exists
try {
  mkdirSync('dist', { recursive: true });
} catch (err) {
  // Directory already exists
}

// Copy plugin-signatures.json to dist folder
try {
  copyFileSync('server/plugin-signatures.json', 'dist/plugin-signatures.json');
  console.log('✓ Copied plugin-signatures.json to dist folder');
} catch (err) {
  console.error('Failed to copy plugin-signatures.json:', err);
  process.exit(1);
}
