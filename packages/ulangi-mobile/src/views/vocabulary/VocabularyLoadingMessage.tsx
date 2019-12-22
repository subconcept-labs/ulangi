/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { DefaultText } from '../common/DefaultText';

export interface VocabularyLoadingMessageProps {
  message: string;
}

@observer
export class VocabularyLoadingMessage extends React.Component<
  VocabularyLoadingMessageProps
> {
  public render(): React.ReactElement<any> {
    return (
      <ScrollView contentContainerStyle={styles.loading_container}>
        <DefaultText style={styles.loading_text}>
          {this.props.message}
        </DefaultText>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  loading_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  loading_text: {
    fontSize: 16,
    color: '#999',
  },
});
