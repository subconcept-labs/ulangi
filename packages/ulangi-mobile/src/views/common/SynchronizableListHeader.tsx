/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { SyncCompletedNotice } from '../common/SyncCompletedNotice';
import { SyncingNotice } from '../common/SyncingNotice';

export interface SynchronizableListHeaderProps {
  shouldShowSyncingNotice: IObservableValue<boolean>;
  shouldShowSyncCompletedNotice: IObservableValue<boolean>;
  refresh: () => void;
}

@observer
export class SynchronizableListHeader extends React.Component<
  SynchronizableListHeaderProps
> {
  public render(): React.ReactElement<any> {
    if (
      this.props.shouldShowSyncingNotice.get() === true ||
      this.props.shouldShowSyncCompletedNotice.get() === true
    ) {
      return (
        <Animatable.View
          style={styles.container}
          animation="slideInDown"
          useNativeDriver={true}
        >
          {this.renderContent()}
        </Animatable.View>
      );
    } else {
      return <View style={styles.container} />;
    }
  }

  private renderContent(): null | React.ReactElement<any> {
    if (this.props.shouldShowSyncingNotice.get() === true) {
      return (
        <SyncingNotice
          shouldShowSyncingNotice={this.props.shouldShowSyncingNotice}
          refresh={this.props.refresh}
        />
      );
    } else if (this.props.shouldShowSyncCompletedNotice.get() === true) {
      return (
        <SyncCompletedNotice
          shouldShowSyncCompletedNotice={
            this.props.shouldShowSyncCompletedNotice
          }
          refresh={this.props.refresh}
        />
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
});
