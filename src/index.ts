import type { ConfigEnv, Plugin, ResolvedConfig, UserConfig } from 'vite';
import { createContext } from './context';
import Uploader from './uploader';
import chalk from 'chalk';

import type { Options } from './types';

const PLUGIN_NAME = 'vite-plugin-blob-storage';

export function ViteBlobStorage(enabled: boolean, userOptions: Options): Plugin {
  const options = createContext(userOptions);
  let vite: ResolvedConfig;

  return {
    name: PLUGIN_NAME,
    enforce: 'post',
    apply(config: UserConfig, { command }: ConfigEnv) {
      return command === 'build' && enabled;
    },
    config(config: UserConfig) {
      if (options.cdnUrl) config.base = options.cdnUrl;
    },
    configResolved(config: ResolvedConfig) {
      vite = config;
    },
    closeBundle: {
      async handler() {
        if (!vite.build.ssr && enabled) {
          console.log(chalk.cyan(`Uploading files to blob storage...`));
          const uploader = new Uploader(options, vite);
          await uploader.run();
        }
      },
    },
  };
}

export { ViteBlobStorage as BlobStoragePlugin };

export type { Options };
