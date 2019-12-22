/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { FlashcardPlayerScreenIds } from '../../constants/ids/FlashcardPlayerScreenIds';

export interface FlashcardPlayerTopBarProps {
  back: () => void;
}

export class FlashcardPlayerTopBar extends React.Component<
  FlashcardPlayerTopBarProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          testID={FlashcardPlayerScreenIds.BACK_BTN}
          hitSlop={{ top: 10, bottom: 10, left: 25, right: 25 }}
          style={styles.button}
          onPress={this.props.back}
        >
          <Image source={Images.ARROW_LEFT_WHITE_22X22} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  button: {},

  score_container: {},

  score_text: {
    fontFamily: 'JosefinSans-bold',
    fontSize: 20,
    color: '#efecca',
  },
});
