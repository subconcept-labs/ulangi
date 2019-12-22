/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Images } from '../../constants/Images';

export class Logo extends React.Component {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.logo_container}>
        <Image source={Images.LOGO_60X60} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logo_container: {
    alignItems: 'center',
  },
});
