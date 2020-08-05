/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import * as React from 'react';
import { Image, TouchableOpacity } from 'react-native';

import { Images } from '../../constants/Images';
import {
  AddVocabularyFloatingButtonStyles,
  addVocabularyFloatingButtonResponsiveStyles,
} from './AddVocabularyFloatingButton.style';

export interface AddVocabularyFloatingButtonProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  addVocabulary: () => void;
}

export class AddVocabularyFloatingButton extends React.Component<
  AddVocabularyFloatingButtonProps
> {
  private get styles(): AddVocabularyFloatingButtonStyles {
    return addVocabularyFloatingButtonResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        style={this.styles.button}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        onPress={this.props.addVocabulary}>
        <Image source={Images.ADD_WHITE_22X22} />
      </TouchableOpacity>
    );
  }
}
