/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';

export class FlashcardPlayerSlogan extends React.Component {
  public render(): React.ReactElement<any> {
    return (
      <View>
        <DefaultText style={styles.text}>
          <DefaultText>Autoplay flashcards</DefaultText>
          <DefaultText style={styles.dot}>{' \u00B7 '}</DefaultText>
          <DefaultText>For multitasking</DefaultText>
        </DefaultText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },

  dot: {
    fontSize: 16,
  },
});
