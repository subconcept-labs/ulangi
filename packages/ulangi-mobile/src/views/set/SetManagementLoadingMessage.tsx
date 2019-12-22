/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';

export interface SetManagementLoadingMessageProps {
  loadingMessage: string;
}

@observer
export class SetManagementLoadingMessage extends React.Component<
  SetManagementLoadingMessageProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.loading_message_container}>
        <DefaultText style={styles.loading_message}>
          {this.props.loadingMessage}
        </DefaultText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading_message_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loading_message: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
  },
});
