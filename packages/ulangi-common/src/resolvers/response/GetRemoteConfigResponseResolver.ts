/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';

import { GetRemoteConfigResponse } from '../../interfaces/response/GetRemoteConfigResponse';
import { RemoteConfigResolver } from '../general/RemoteConfigResolver';

export class GetRemoteConfigResponseResolver extends AbstractResolver<
  GetRemoteConfigResponse
> {
  private remoteConfigResolver = new RemoteConfigResolver();

  protected rules = {
    remoteConfig: this.remoteConfigResolver.getRules(),
  };
}
