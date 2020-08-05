/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DefaultText } from '../common/DefaultText';
import {
  TranslateWithGoogleButtonStyles,
  translateWithGoogleButtonResponsiveStyles,
} from './TranslateWithGoogleButton.style';

export interface TranslateWithGoogleButtonProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  translate: () => void;
}

export class TranslateWithGoogleButton extends React.Component<
  TranslateWithGoogleButtonProps
> {
  private get styles(): TranslateWithGoogleButtonStyles {
    return translateWithGoogleButtonResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.translate_btn_container}>
        <TouchableOpacity
          testID={VocabularyFormIds.TRANSLATE_WITH_GOOGLE_BTN}
          style={this.styles.translate_btn}
          onPress={this.props.translate}>
          <DefaultText style={this.styles.translate_btn_text}>
            TRANSLATE WITH GOOGLE
          </DefaultText>
        </TouchableOpacity>
      </View>
    );
  }
}
