import { URL } from 'node:url';
import type { Options } from './types';

export function createContext(options: Options): Options & {
  cdnUrl: string;
} {
  let cdnUrl = '/';
  if (options.basePath && options.containerName) {
    cdnUrl = new URL(options.containerName, options.basePath).toString();

    if (options.subPath) {
      cdnUrl += `/${options.subPath}`;
    }
  }

  return {
    ...options,
    cdnUrl,
  };
}
