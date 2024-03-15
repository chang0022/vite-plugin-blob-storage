export interface BlobClientConfig {
  /**
   * The name of the Azure Storage account.
   */
  accountName: string
  /**
   * The account key for the Azure Storage account.
   */
  accountKey: string
  /**
   * The name of the container.
   * @description
   * - The length of a container name can be from 3 to 63 characters.
   * - The container name must start with a letter or number and can only contain lowercase letters, numbers, and hyphens (-).
   * - Consecutive hyphens are not allowed in the container name.
   */
  containerName: string
}

/**
 * Plugin options.
 */
export interface Options extends BlobClientConfig {
  /**
   * A Pattern to match for excluded content.
   */
  excludes?: string[]
  /**
   * The domain of Azure CDN will modify the base of the output files.
   */
  basePath?: string
}

/**
 * Files.
 */
export interface File {
  /**
   * absolute path of the file.
   */
  path: string
  /**
   * relative path of the file. (from the directory)
   */
  name: string
}
