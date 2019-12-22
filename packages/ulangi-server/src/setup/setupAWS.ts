/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as AWS from 'aws-sdk';

export function setupAWS(
  accessKey: string,
  secretKey: string,
  defaultRegion: string
): void {
  AWS.config.update({
    credentials: new AWS.Credentials(accessKey, secretKey),
    region: defaultRegion,
  });
}
