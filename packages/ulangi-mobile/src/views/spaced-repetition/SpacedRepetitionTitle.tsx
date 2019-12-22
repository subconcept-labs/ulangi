/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Images } from '../../constants/Images';

export interface SpacedRepetitionTitleStyles {
  theme: Theme;
}

@observer
export class SpacedRepetitionTitle extends React.Component<
  SpacedRepetitionTitleStyles
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <Image
          style={styles.title}
          source={
            this.props.theme === Theme.LIGHT
              ? Images.SPACED_REPETITION_TITLE_BLACK_184X42
              : Images.SPACED_REPETITION_TITLE_WHITE_184X42
          }
        />
        <Image
          style={styles.floral}
          source={Images.SPACED_REPETITION_FLORAL_50X76}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {},

  floral: {
    marginTop: 18,
  },
});
