/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DefaultText } from '../common/DefaultText';

export interface TranslateWithGoogleButtonProps {
  translate: () => void;
}

export class TranslateWithGoogleButton extends React.Component<
  TranslateWithGoogleButtonProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.translate_btn_container}>
        <TouchableOpacity
          testID={VocabularyFormIds.TRANSLATE_WITH_GOOGLE_BTN}
          style={styles.translate_btn}
          onPress={this.props.translate}>
          <DefaultText style={styles.translate_btn_text}>
            TRANSLATE WITH GOOGLE
          </DefaultText>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  translate_btn_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  translate_btn: {
    backgroundColor: '#ddd',
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },

  translate_btn_text: {
    paddingHorizontal: 16,
    color: '#444',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
