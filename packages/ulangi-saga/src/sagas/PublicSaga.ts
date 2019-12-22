/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SagaConfig } from '../interfaces/SagaConfig';

export abstract class PublicSaga {
  public abstract run(config: SagaConfig): IterableIterator<any>;
}
