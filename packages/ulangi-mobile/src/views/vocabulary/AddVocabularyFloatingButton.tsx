/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';

export interface AddVocabularyFloatingButtonProps {
  addVocabulary: () => void;
}

export class AddVocabularyFloatingButton extends React.Component<
  AddVocabularyFloatingButtonProps
> {
  public render(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        style={styles.button}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        onPress={this.props.addVocabulary}>
        <Image source={Images.ADD_WHITE_22X22} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: ss(50),
    height: ss(50),
    borderRadius: ss(50) / 2,
    backgroundColor: config.styles.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowRadius: 1,
    shadowOpacity: 0.2,
    elevation: 1,
  },
});
