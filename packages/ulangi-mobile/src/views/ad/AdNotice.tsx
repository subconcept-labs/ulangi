/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';

export class AdNotice extends React.Component {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <DefaultText style={styles.text}>
          To support developent and maintenance of this open-source project, an
          ad will be shown next. Thank you!
        </DefaultText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    padding: 12,
    paddingHorizontal: 16,
    borderColor: '#778899',
    borderWidth: StyleSheet.hairlineWidth,
  },

  text: {
    fontSize: 14,
    color: '#708090',
  },
});
