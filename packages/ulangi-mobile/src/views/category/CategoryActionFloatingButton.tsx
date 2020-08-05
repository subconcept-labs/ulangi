/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity } from 'react-native';

import { Images } from '../../constants/Images';
import {
  CategoryActionFloatingButtonStyles,
  categoryActionFloatingButtonResponsiveStyles,
} from './CategoryActionFloatingButton.style';

export interface CategoryActionFloatingButtonProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  showCategoryActionMenu: () => void;
}

@observer
export class CategoryActionFloatingButton extends React.Component<
  CategoryActionFloatingButtonProps
> {
  private get styles(): CategoryActionFloatingButtonStyles {
    return categoryActionFloatingButtonResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        style={this.styles.button}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        onPress={this.props.showCategoryActionMenu}>
        <Image source={Images.HORIZONTAL_DOTS_WHITE_22X22} />
      </TouchableOpacity>
    );
  }
}
