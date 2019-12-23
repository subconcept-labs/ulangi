/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservablePixabayImage } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  SelectableImageStyles,
  darkStyles,
  lightStyles,
} from './SelectableImage.style';

export interface SelectableImageProps {
  theme: Theme;
  image: ObservablePixabayImage;
  toggleSelect: () => void;
  styles?: {
    light: SelectableImageStyles;
    dark: SelectableImageStyles;
  };
}

@observer
export class SelectableImage extends React.Component<SelectableImageProps> {
  public get styles(): SelectableImageStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        style={this.styles.image_container}
        onPress={this.props.toggleSelect}>
        <FastImage
          style={[
            this.styles.image,
            this.props.image.isSelected.get() ? this.styles.selected : null,
          ]}
          source={{ uri: this.props.image.previewURL }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }
}
