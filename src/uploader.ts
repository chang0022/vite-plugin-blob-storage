import type { ResolvedConfig } from 'vite';
import { lookup } from 'mime-types';
import type { BlobUploadCommonResponse, ContainerClient } from '@azure/storage-blob';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import type { File, Options } from './types';
import { logResult } from './log';

import { getAllFilesInDirectory, getDirectoryFilesRecursive, validateBlobClientConfig } from './helpers';

function getBlobServiceClientWithKey(accountName: string, accountKey: string) {
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
  return blobServiceClient;
}

function getBlobServiceClientWithToken(accountName: string, sasToken: string) {
  const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
  return blobServiceClient;
}

async function createContainer(containerName: string, blobServiceClient: BlobServiceClient): Promise<ContainerClient> {
  return blobServiceClient.getContainerClient(containerName);
}

export default class Uploader {
  options: Options;
  vite: ResolvedConfig;
  blobServiceClient: BlobServiceClient;
  containerClient?: ContainerClient;
  directory: string;

  constructor(options: Options, vite: ResolvedConfig) {
    this.options = options;
    this.vite = vite;
    validateBlobClientConfig(this.options);
    const { accountName, accountKey, sasToken } = this.options;
    if (accountKey) {
      this.blobServiceClient = getBlobServiceClientWithKey(accountName, accountKey);
    } else {
      this.blobServiceClient = getBlobServiceClientWithToken(accountName, sasToken!);
    }

    this.directory = `${this.vite.root}/${this.vite.build.outDir}`;
  }

  async uploadFile(fileName: string, filePath: string): Promise<BlobUploadCommonResponse> {
    const nameWithPath = this.options.subPath ? `${this.options.subPath}/${fileName}` : fileName;
    const blockBlobClient = this.containerClient!.getBlockBlobClient(nameWithPath);
    return await blockBlobClient.uploadFile(filePath, {
      blobHTTPHeaders: {
        blobContentType: lookup(fileName) || 'application/octet-stream',
      },
    });
  }

  async uploadFiles(files: File[]): Promise<BlobUploadCommonResponse[]> {
    const uploadFiles = files.map((file: File) => this.uploadFile(file.name, file.path));
    return await Promise.all(uploadFiles);
  }

  async run() {
    const allFiles = getAllFilesInDirectory(this.directory);
    const { excludes } = this.options;
    const files = getDirectoryFilesRecursive(this.directory, allFiles, excludes);
    this.containerClient = await createContainer(this.options.containerName, this.blobServiceClient);
    await this.uploadFiles(files);
    logResult(files, this.vite);
  }
}
