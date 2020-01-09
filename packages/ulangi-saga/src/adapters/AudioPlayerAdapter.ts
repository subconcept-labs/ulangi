import { ErrorCode } from '@ulangi/ulangi-common/enums';
import * as path from 'path';

import Player = require('react-native-sound');

export class AudioPlayerAdapter {
  private currentSound: undefined | Player;

  private player: typeof Player;

  public constructor(player: typeof Player) {
    this.player = player;
  }

  public async stopCurrentSound(): Promise<void> {
    return new Promise(
      (resolve): void => {
        if (typeof this.currentSound !== 'undefined') {
          this.currentSound.stop(
            (): void => {
              resolve();
            }
          );
        } else {
          resolve();
        }
      }
    );
  }

  public async releaseCurrentSound(): Promise<void> {
    if (typeof this.currentSound !== 'undefined') {
      this.currentSound.release();
    }
  }

  public async play(filePath: string): Promise<void> {
    return new Promise(
      (resolve, reject): void => {
        const fileName = path.basename(filePath);
        const baseDir = path.dirname(filePath);
        this.player.setCategory('Playback', false);

        this.currentSound = new this.player(
          fileName,
          baseDir,
          (error: any): void => {
            if (error) {
              reject(error);
            } else {
              if (typeof this.currentSound !== 'undefined') {
                this.currentSound.play(
                  (success): void => {
                    if (success) {
                      resolve();
                    } else {
                      reject(ErrorCode.GENERAL__UNKNOWN_ERROR);
                    }
                  }
                );
              } else {
                reject('currentSound is undefined.');
              }
            }
          }
        );
      }
    );
  }
}
