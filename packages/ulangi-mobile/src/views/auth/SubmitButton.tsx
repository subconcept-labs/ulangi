/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { DefaultText } from '../common/DefaultText';

export interface SubmitButtonProps {
  testID: string;
  buttonText: string;
  onSubmit: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export class SubmitButton extends React.Component<SubmitButtonProps> {
  public render(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={[styles.button_touchable, this.props.style]}
        onPress={this.props.onSubmit}
      >
        <DefaultText style={[styles.button_text, this.props.textStyle]}>
          {this.props.buttonText}
        </DefaultText>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button_touchable: {
    alignSelf: 'stretch',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 8,
    marginHorizontal: 16,
    backgroundColor: '#00c7fe',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button_text: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Arial',
    fontWeight: '700',
    textAlign: 'center',
  },
});
