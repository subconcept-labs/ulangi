/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';

export interface SyncCompletedNoticeProps {
  shouldShowSyncCompletedNotice: IObservableValue<boolean>;
  refresh: () => void;
}

@observer
export class SyncCompletedNotice extends React.Component<
  SyncCompletedNoticeProps
> {
  public render(): null | React.ReactElement<any> {
    if (this.props.shouldShowSyncCompletedNotice.get() === true) {
      return (
        <TouchableOpacity onPress={this.props.refresh} style={styles.container}>
          <DefaultText style={styles.text}>
            <DefaultText>Sync completed. </DefaultText>
            <DefaultText style={styles.highlighted_text}>
              Refresh content
            </DefaultText>
          </DefaultText>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 30,
    borderRadius: 30,
    backgroundColor: config.styles.primaryColor,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
    elevation: 3,
    marginBottom: -3,
  },

  icon: {
    marginRight: 4,
  },

  text: {
    textAlign: 'center',
    fontSize: 13,
    color: 'white',
  },

  dot: {
    fontWeight: '700',
  },

  highlighted_text: {
    fontWeight: '700',
  },
});
