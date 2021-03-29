/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DatabaseFacade, ModelList } from '@ulangi/ulangi-local-database';

import { NetInfoAdapter } from '../adapters/NetInfoAdapter';
import { SystemThemeAdapter } from '../adapters/SystemThemeAdapter';
import { AppSaga } from '../sagas/AppSaga';
import { AuthSaga } from '../sagas/AuthSaga';
import { DatabaseSaga } from '../sagas/DatabaseSaga';
import { NetworkSaga } from '../sagas/NetworkSaga';
import { PublicSaga } from '../sagas/PublicSaga';
import { RemoteConfigSaga } from '../sagas/RemoteConfigSaga';
import { ThemeSaga } from '../sagas/ThemeSaga';

export class PublicSagaFactory {
  private database: DatabaseFacade;
  private modelList: ModelList;
  private netInfo: NetInfoAdapter;
  private systemTheme: SystemThemeAdapter;

  public constructor(
    database: DatabaseFacade,
    modelList: ModelList,
    netInfo: NetInfoAdapter,
    systemTheme: SystemThemeAdapter
  ) {
    this.database = database;
    this.modelList = modelList;
    this.netInfo = netInfo;
    this.systemTheme = systemTheme;
  }

  public createAllPublicSagas(): readonly PublicSaga[] {
    const sagas: PublicSaga[] = [
      new AppSaga(),
      new AuthSaga(
        this.database,
        this.modelList.sessionModel,
        this.modelList.userModel
      ),
      new DatabaseSaga(this.database),
      new NetworkSaga(this.netInfo),
      new RemoteConfigSaga(this.database, this.modelList.remoteConfigModel),
      new ThemeSaga(this.systemTheme),
    ];

    return sagas;
  }
}
