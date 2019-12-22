/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableVocabulary } from '@ulangi/ulangi-observable';
import * as moment from 'moment';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';

export interface VocabularyDetailInfoProps {
  vocabulary: ObservableVocabulary;
}

export class VocabularyDetailInfo extends React.Component<
  VocabularyDetailInfoProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <View style={styles.title_container}>
          <DefaultText style={styles.title_text}>INFO</DefaultText>
        </View>
        <View style={styles.content_container}>
          <View style={styles.row_container}>
            <DefaultText style={styles.left_text}>Sync</DefaultText>
            <DefaultText style={styles.right_text}>
              {this.props.vocabulary.updatedAt === null
                ? 'Not yet'
                : moment(this.props.vocabulary.updatedAt).fromNow()}
            </DefaultText>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
  },

  title_container: {
    paddingHorizontal: 16,
  },

  title_text: {
    fontSize: 12,
    color: '#999',
  },

  content_container: {
    marginTop: 6,
    backgroundColor: 'white',
    borderTopColor: '#cecece',
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  row_container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomColor: '#cecece',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left_text: {
    fontSize: 16,
    color: '#333',
  },

  right_text: {
    fontSize: 16,
    color: '#888',
  },
});
