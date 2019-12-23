/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { Dialog } from '@ulangi/ulangi-common/interfaces';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButtonProps } from '../common/DefaultButton';
import { LightBoxButtonList } from './LightBoxButtonList';
import {
  LightBoxDialogStyles,
  darkStyles,
  lightStyles,
} from './LightBoxDialog.style';
import { LightBoxMessage } from './LightBoxMessage';
import { LightBoxTitle } from './LightBoxTitle';

export interface LightBoxDialogProps {
  theme: Theme;
  dialog: Dialog;
  close: () => void;
}

@observer
export class LightBoxDialog extends React.Component<LightBoxDialogProps> {
  public get styles(): LightBoxDialogStyles {
    return this.props.theme === Theme.LIGHT ? lightStyles : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View
        testID={this.props.dialog.testID || LightBoxDialogIds.DIALOG}
        style={this.styles.dialog_container}
        onStartShouldSetResponder={(): boolean => true}>
        {typeof this.props.dialog.title !== 'undefined' ? (
          <LightBoxTitle
            theme={this.props.theme}
            title={this.props.dialog.title}
          />
        ) : null}
        <LightBoxMessage
          theme={this.props.theme}
          message={this.props.dialog.message}
        />
        <LightBoxButtonList buttonList={this.getButtonList()} />
      </View>
    );
  }

  private getButtonList(): readonly DefaultButtonProps[] {
    const buttonList =
      typeof this.props.dialog.buttonList !== 'undefined'
        ? this.props.dialog.buttonList.slice()
        : [];

    if (this.props.dialog.showCloseButton === true) {
      buttonList.unshift({
        testID: LightBoxDialogIds.CLOSE_DIALOG_BTN,
        text: 'CLOSE',
        styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
          ButtonSize.SMALL,
        ),
        onPress: this.props.close,
      });
    }

    return buttonList;
  }
}
