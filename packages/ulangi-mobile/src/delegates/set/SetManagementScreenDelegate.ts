/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType } from '@ulangi/ulangi-action';
import { ActivityState, SetStatus } from '@ulangi/ulangi-common/enums';
import { FetchSetDelegate } from '@ulangi/ulangi-delegate';
import { EventBus, on } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableSet,
  ObservableSetManagementScreen,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { observable } from 'mobx';

import { SetActionMenuDelegate } from './SetActionMenuDelegate';

@boundClass
export class SetManagementScreenDelegate {
  private eventBus: EventBus;
  private observableConverter: ObservableConverter;
  private observableScreen: ObservableSetManagementScreen;
  private fetchSetDelegate: FetchSetDelegate;
  private setActionMenuDelegate: SetActionMenuDelegate;

  public constructor(
    eventBus: EventBus,
    observableConverter: ObservableConverter,
    observableScreen: ObservableSetManagementScreen,
    fetchSetDelegate: FetchSetDelegate,
    setActionMenuDelegate: SetActionMenuDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableConverter = observableConverter;
    this.observableScreen = observableScreen;
    this.fetchSetDelegate = fetchSetDelegate;
    this.setActionMenuDelegate = setActionMenuDelegate;
  }

  public selectAndFetchSets(setStatus: SetStatus): void {
    this.observableScreen.selectedSetStatus = setStatus;
    this.fetchSets();
  }

  public refresh(): void {
    this.observableScreen.refreshing = true;
    this.fetchSets();
  }

  public showSetActionMenu(set: ObservableSet): void {
    this.setActionMenuDelegate.show(set);
  }

  public autoRefreshOnSetChange(): void {
    this.eventBus.subscribe(
      on(
        [
          ActionType.SET__ADD_SUCCEEDED,
          ActionType.SET__EDIT_SUCCEEDED,
          ActionType.SET__DOWNLOAD_SETS_SUCCEEDED,
        ],
        (): void => {
          this.refresh();
        },
      ),
    );
  }

  private fetchSets(): void {
    this.fetchSetDelegate.fetchSets(this.observableScreen.selectedSetStatus, {
      onFetching: (): void => {
        this.observableScreen.fetchState = ActivityState.ACTIVE;
      },
      onFetchSucceeded: (setList): void => {
        this.observableScreen.setList = observable.map(
          setList.map(
            (set): [string, ObservableSet] => {
              return [
                set.setId,
                this.observableConverter.convertToObservableSet(set),
              ];
            },
          ),
        );
        this.observableScreen.fetchState = ActivityState.INACTIVE;
        this.observableScreen.refreshing = false;
      },
      onFetchFailed: (): void => {
        this.observableScreen.fetchState = ActivityState.ERROR;
        this.observableScreen.refreshing = false;
      },
    });
  }
}
