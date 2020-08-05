/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableSetManagementScreen,
  ObservableSetStore,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { SetManagementScreenIds } from '../../constants/ids/SetManagementScreenIds';
import { SetManagementScreenDelegate } from '../../delegates/set/SetManagementScreenDelegate';
import { Screen } from '../common/Screen';
import { SetList } from './SetList';
import { SetManagementTopBar } from './SetManagementTopBar';

export interface SetManagementScreenProps {
  setStore: ObservableSetStore;
  themeStore: ObservableThemeStore;
  observableScreen: ObservableSetManagementScreen;
  screenDelegate: SetManagementScreenDelegate;
}

@observer
export class SetManagementScreen extends React.Component<
  SetManagementScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={styles.screen}
        testID={SetManagementScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <SetManagementTopBar
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          selectedSetStatus={this.props.observableScreen.selectedSetStatus}
          selectSetStatus={this.props.screenDelegate.selectAndFetchSets}
        />
        <SetList
          testID={SetManagementScreenIds.SET_LIST}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          currentSetId={this.props.setStore.existingCurrentSetId}
          setList={this.props.observableScreen.setList}
          isRefreshing={this.props.observableScreen.refreshing}
          refresh={this.props.screenDelegate.refresh}
          showSetActionMenu={this.props.screenDelegate.showSetActionMenu}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
