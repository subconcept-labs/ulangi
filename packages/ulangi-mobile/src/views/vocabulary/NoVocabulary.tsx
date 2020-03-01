/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observer } from 'mobx-react';
import * as React from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

import { DefaultText } from '../common/DefaultText';

export interface NoVocabularyProps {
  refresh: () => void;
}

@observer
export class NoVocabulary extends React.Component<NoVocabularyProps> {
  public render(): React.ReactElement<any> {
    return (
      <ScrollView
        contentContainerStyle={styles.scroll_view_container}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={this.props.refresh} />
        }>
        {this.renderText()}
      </ScrollView>
    );
  }

  private renderText(): React.ReactElement<any> {
    return (
      <DefaultText style={styles.no_vocabulary_text}>
        No vocabulary yet.
      </DefaultText>
    );
  }
}

const styles = StyleSheet.create({
  scroll_view_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  animation_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  no_vocabulary_text: {
    textAlign: 'center',
    fontSize: 15,
    color: '#999',
    lineHeight: 19,
  },
});
