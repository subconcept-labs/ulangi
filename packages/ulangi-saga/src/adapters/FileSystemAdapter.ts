import * as RNFileSystem from 'react-native-fs';

// eslint-disable-next-line
export namespace FileSystem {
  export type DownloadResult = RNFileSystem.DownloadResult;
}

export class FileSystemAdapter {
  private fileSystem: typeof RNFileSystem;

  public readonly CachesDirectoryPath: string;
  public readonly DocumentDirectoryPath: string;

  public constructor(fileSystem: typeof RNFileSystem) {
    this.fileSystem = fileSystem;

    this.CachesDirectoryPath = this.fileSystem.CachesDirectoryPath;
    this.DocumentDirectoryPath = this.fileSystem.DocumentDirectoryPath;
  }

  public mkdir(dir: string): Promise<void> {
    return this.fileSystem.mkdir(dir);
  }

  public exists(path: string): Promise<boolean> {
    return this.fileSystem.exists(path);
  }

  public unlink(path: string): Promise<void> {
    return this.fileSystem.unlink(path);
  }

  public downloadFile(
    options: RNFileSystem.DownloadFileOptions
  ): { jobId: number; promise: Promise<RNFileSystem.DownloadResult> } {
    return this.fileSystem.downloadFile(options);
  }
}
