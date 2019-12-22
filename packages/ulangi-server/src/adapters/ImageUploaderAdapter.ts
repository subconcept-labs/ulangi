/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { PixabayImage } from '@ulangi/ulangi-common/interfaces';
import * as AWS from 'aws-sdk';
import axios from 'axios';
import * as path from 'path';

export class ImageUploaderAdapter {
  private s3: AWS.S3;

  public constructor(s3: AWS.S3) {
    this.s3 = s3;
  }

  public async uploadImages(
    images: PixabayImage[],
    bucketName: string,
    folderName: string
  ): Promise<string[]> {
    return Promise.all(
      images.map(
        async (image): Promise<string> => {
          const url = image.webformatURL;
          const extension = path.extname(
            url.substring(url.lastIndexOf('/') + 1)
          );
          const filePath = folderName + '/' + image.id + '_medium' + extension;

          const exists = await this.imageExists(filePath, bucketName);
          if (exists) {
            return filePath;
          } else {
            return axios
              .get(image.webformatURL, { responseType: 'arraybuffer' })
              .then(
                (res): Promise<AWS.S3.ManagedUpload.SendData> => {
                  return this.s3
                    .upload({
                      ACL: 'public-read',
                      Bucket: bucketName,
                      Body: res.data,
                      Key: filePath,
                    })
                    .promise();
                }
              )
              .then(
                (data: AWS.S3.ManagedUpload.SendData): string => {
                  return data.Key;
                }
              );
          }
        }
      )
    );
  }

  private imageExists(id: string, bucketName: string): Promise<boolean> {
    return this.s3
      .headObject({
        Bucket: bucketName,
        Key: id,
      })
      .promise()
      .then(
        (): boolean => true,
        (err): boolean => {
          if (err.code === 'NotFound') {
            return false;
          }
          throw err;
        }
      );
  }
}
