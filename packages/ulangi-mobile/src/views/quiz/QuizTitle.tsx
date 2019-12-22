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

export interface QuizTitleProps {
  theme: Theme;
}

@observer
export class QuizTitle extends React.Component<QuizTitleProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <Image
          style={styles.title}
          source={
            this.props.theme === Theme.LIGHT
              ? Images.QUIZ_TITLE_BLACK_118X42
              : Images.QUIZ_TITLE_WHITE_118X42
          }
        />
        <Image style={styles.floral} source={Images.QUIZ_FLORAL_40X80} />
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
    marginTop: 12,
  },
});
