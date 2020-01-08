/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { RemoteConfig } from '@ulangi/ulangi-common/interfaces';

import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';

export abstract class ProtectedSaga {
  public abstract run(
    env: SagaEnv,
    config: SagaConfig,
    remoteConfig: RemoteConfig
  ): IterableIterator<any>;

  public destroy(): void {}
}
