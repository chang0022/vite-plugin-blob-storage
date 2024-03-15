/* eslint-disable no-console */
import { relative } from 'node:path';
import chalk from 'chalk';
import type { ResolvedConfig } from 'vite';
import type { File } from './types';

export function logResult(files: File[], vite: ResolvedConfig) {
  const { root, logLevel = 'info' } = vite;

  if (logLevel === 'silent') return;

  if (logLevel === 'info') {
    console.info(
      [
        '',
        `${chalk.cyan('Upload finished.')}`,
        `✓ ${files.length} files uploaded`,
        ...files.map((p: File) => `${chalk.dim(relative(root, p.path))}`),
      ].join('\n')
    );
  }
}
