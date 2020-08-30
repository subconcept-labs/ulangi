import {
  ActivityState,
  CategorySortType,
  ScreenName,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import {
  ObservableCategoryListState,
  ObservableManageScreen,
  ObservableTouchableTopBar,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { ManageScreenFactory } from '../../factories/manage/ManageScreenFactory';
import { ManageScreen } from './ManageScreen';

@observer
export class ManageScreenContainer extends Container {
  protected observableScreen = new ObservableManageScreen(
    0,
    observable.box("table"),
    observable.box(CategorySortType.SORT_BY_NAME_ASC),
    observable.box(VocabularyStatus.ACTIVE),
    new ObservableCategoryListState(
      null,
      false,
      observable.box(ActivityState.INACTIVE),
      observable.box(this.props.rootStore.syncStore.currentState === 'SYNCING'),
      observable.box(false),
      observable.box(false),
      observable.box(false),
    ),
    this.props.componentId,
    ScreenName.MANAGE_SCREEN,
    new ObservableTouchableTopBar('', '', '', _.noop, null, null),
  );

  private screenFactory = new ManageScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen
  );

  public componentDidAppear(): void {
    this.observableScreen.screenAppearedTimes += 1;

    // Do not put autorun in componentDidMount
    // because some are fired too early (before screen appears)
    if (this.observableScreen.screenAppearedTimes === 1) {
      this.screenDelegate.autoShowSyncingInProgress();
      this.screenDelegate.autoShowRefreshNotice();
      this.screenDelegate.autoRefreshOnSetChange();
      this.screenDelegate.autoRefreshOnMultipleEdit();
      this.screenDelegate.autoUpdateDueAndNewCounts();
      this.screenDelegate.prepareAndFetch();

      this.screenDelegate.autorun();
    }

    if (this.observableScreen.categoryListState.shouldShowRefreshNotice.get()) {
      this.screenDelegate.refresh();
    }
  }

  public render(): React.ReactElement {
    return (
      <ManageScreen
        setStore={this.props.rootStore.setStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
