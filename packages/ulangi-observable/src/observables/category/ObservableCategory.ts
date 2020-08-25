/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { IObservableValue, observable } from 'mobx';

export class ObservableCategory {
  @observable
  public categoryName: string;

  @observable
  public totalCount: number;

  @observable
  public srLevel0Count: number;

  @observable
  public srLevel1To3Count: number;

  @observable
  public srLevel4To6Count: number;

  @observable
  public srLevel7To8Count: number;

  @observable
  public srLevel9To10Count: number;

  @observable
  public wrLevel0Count: number;

  @observable
  public wrLevel1To3Count: number;

  @observable
  public wrLevel4To6Count: number;

  @observable
  public wrLevel7To8Count: number;

  @observable
  public wrLevel9To10Count: number;

  @observable
  public spacedRepetitionCounts:
    | undefined
    | {
        due: number;
        new: number;
      };

  @observable
  public writingCounts:
    | undefined
    | {
        due: number;
        new: number;
      };

  public readonly isSelected: IObservableValue<boolean>;

  public constructor(
    categoryName: string,
    totalCount: number,
    srLevel0Count: number,
    srLevel1To3Count: number,
    srLevel4To6Count: number,
    srLevel7To8Count: number,
    srLevel9To10Count: number,
    wrLevel0Count: number,
    wrLevel1To3Count: number,
    wrLevel4To6Count: number,
    wrLevel7To8Count: number,
    wrLevel9To10Count: number,
    isSelected: boolean
  ) {
    this.categoryName = categoryName;
    this.totalCount = totalCount;
    this.srLevel0Count = srLevel0Count;
    this.srLevel1To3Count = srLevel1To3Count;
    this.srLevel4To6Count = srLevel4To6Count;
    this.srLevel7To8Count = srLevel7To8Count;
    this.srLevel9To10Count = srLevel9To10Count;
    this.wrLevel0Count = wrLevel0Count;
    this.wrLevel1To3Count = wrLevel1To3Count;
    this.wrLevel4To6Count = wrLevel4To6Count;
    this.wrLevel7To8Count = wrLevel7To8Count;
    this.wrLevel9To10Count = wrLevel9To10Count;
    this.isSelected = observable.box(isSelected);
  }
}
