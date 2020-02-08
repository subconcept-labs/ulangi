import * as RNFileSystem from 'react-native-fs';

// eslint-disable-next-line
export namespace FileSystem {
  export type DownloadResult = RNFileSystem.DownloadResult;
}

export class FileSystemAdapter {
  private fileSystem: typeof RNFileSystem;

  public readonly CachesDirectoryPath = RNFileSystem.CachesDirectoryPath;
  public readonly DocumentDirectoryPath = RNFileSystem.DocumentDirectoryPath;

  public constructor(fileSystem: typeof RNFileSystem) {
    this.fileSystem = fileSystem;
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
