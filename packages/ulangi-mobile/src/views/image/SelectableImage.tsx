/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservablePixabayImage,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  SelectableImageStyles,
  selectableImageResponsiveStyles,
} from './SelectableImage.style';

export interface SelectableImageProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  image: ObservablePixabayImage;
  toggleSelect: () => void;
  imagePadding: number;
  imageDimensions: { width: number; height: number };
}

@observer
export class SelectableImage extends React.Component<SelectableImageProps> {
  public get styles(): SelectableImageStyles {
    return selectableImageResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        style={[
          this.styles.image_container,
          {
            padding: this.props.imagePadding,
          },
        ]}
        onPress={this.props.toggleSelect}>
        <FastImage
          style={[
            this.styles.image,
            this.props.image.isSelected.get() ? this.styles.selected : null,
            {
              width: this.props.imageDimensions.width,
              height: this.props.imageDimensions.height,
            },
          ]}
          source={{ uri: this.props.image.previewURL }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }
}
