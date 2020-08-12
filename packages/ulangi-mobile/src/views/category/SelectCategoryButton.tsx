/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { ButtonStyles } from '@ulangi/ulangi-common/interfaces';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { IObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import {
  SelectCategoryButtonStyles,
  selectCategoryButtonResponsiveStyles,
} from './SelectCategoryButton.style';

export interface SelectCategoryButtonProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  selectedCategoryNames: undefined | IObservableArray<string>;
  selectCategory: () => void;
  buttonStyles?: ButtonStyles;
}

@observer
export class SelectCategoryButton extends React.Component<
  SelectCategoryButtonProps
> {
  private get styles(): SelectCategoryButtonStyles {
    return selectCategoryButtonResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return <View style={this.styles.container}>{this.renderContent()}</View>;
  }

  private renderContent(): React.ReactElement<any> {
    const text =
      typeof this.props.selectedCategoryNames !== 'undefined'
        ? this.props.selectedCategoryNames.join(', ')
        : 'All categories';

    return (
      <DefaultButton
        onPress={this.props.selectCategory}
        styles={
          this.props.buttonStyles
            ? this.props.buttonStyles
            : fullRoundedButtonStyles.getGreyOutlineStyles(
                ButtonSize.NORMAL,
                this.props.theme,
                this.props.screenLayout,
              )
        }
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        text={text}
      />
    );
  }
}
