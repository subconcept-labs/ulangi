/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';

export class FlashcardPlayerTitle extends React.Component {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <DefaultText allowFontScaling={false} style={styles.title}>
          {'FLASHCARD\nPLAYER'}
        </DefaultText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },

  title: {
    fontFamily: 'Raleway-Black',
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    //shadowColor: "#000000",
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.10,
  },
});
