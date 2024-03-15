# Vite Plugin Blob Storage

> Package file uploader Plugin for Vite [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs)

## Features

- Supports Account Key, does not support SAS token.
- Supports modifying the base URL.

## Install

```Bash
pnpm add @metalist/vite-plugin-blob-storage -D
```

## Usage

**`vite.config.ts`**

[Using Environment Variables in Config](https://vitejs.dev/config/#using-environment-variables-in-config)

```Javascript
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { ViteBlobStorage } from "@metalist/vite-plugin-blob-storage";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react(),
      ViteBlobStorage(env.VITE_USE_CDN === 'true', {
        basePath: env.VITE_BLOB_CDN_PATH, // your CDN URL or Blob Storage URL
        accountName: env.VITE_BLOB_ACCOUNT_NAME,
        accountKey: env.VITE_BLOB_ACCOUNT_KEY,
        containerName: env.VITE_BLOB_CONTAINER_NAME,
        excludes: ['index.html'],
      })
    ],
  };
});

```

**Options**

|           Name           |       Type        |        Default         | Required | Description                                                       |
| :----------------------: | :---------------: | :--------------------: | :------: | :---------------------------------------------------------------- |
|  **[`accountName`](#)**  |    `{String}`     |                        |   true   | The name of the Azure Storage account.                            |
|  **[`accountKey`](#)**   |    `{String}`     |                        |   true   | he account key for the Azure Storage account.                     |
| **[`containerName`](#)** |    `{String}`     |                        |   true   | The name of the container.                                        |
|   **[`excludes`](#)**    | `{Array[string]}` | ['.DS_Store', '*.map'] |  false   | excluded content 型                                               |
|   **[`basePath`](#)**    |    `{String}`     |                        |  false   | The domain of Azure CDN will modify the base of the output files. |

- `containerName`

  - The length of a container name can be from 3 to 63 characters.
  - The container name must start with a letter or number and can only contain lowercase letters, numbers, and hyphens (-).
  - Consecutive hyphens are not allowed in the container name.

- `excludes` Matching related files or folders. For detailed usage, please refer to: [micromatch](https://github.com/micromatch/micromatch)
  - `*.map` do not upload files with the `map` file extension.

---

## Thanks

Thanks to [vite-plugin-s3](https://github.com/SergkeiM/vite-plugin-s3) used as inspiration fro this plugin

## License

Released under the [MIT License](LICENSE).
