/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ButtonProps,
  ButtonStyles,
  Dialog,
} from '@ulangi/ulangi-common/interfaces';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { Layout } from '../../utils/responsive';
import { LightBoxButtonList } from './LightBoxButtonList';
import {
  LightBoxDialogStyles,
  lightBoxDialogResponsiveStyles,
} from './LightBoxDialog.style';
import { LightBoxMessage } from './LightBoxMessage';
import { LightBoxTitle } from './LightBoxTitle';

export interface LightBoxDialogProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  dialog: Dialog;
  close: () => void;
}

@observer
export class LightBoxDialog extends React.Component<LightBoxDialogProps> {
  public get styles(): LightBoxDialogStyles {
    return lightBoxDialogResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
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
            screenLayout={this.props.screenLayout}
            title={this.props.dialog.title}
          />
        ) : null}
        <LightBoxMessage
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          message={this.props.dialog.message}
        />
        <LightBoxButtonList
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          buttonList={this.getButtonList()}
        />
      </View>
    );
  }

  private getButtonList(): readonly ButtonProps[] {
    const buttonList =
      typeof this.props.dialog.buttonList !== 'undefined'
        ? this.props.dialog.buttonList.slice()
        : [];

    if (this.props.dialog.showCloseButton === true) {
      buttonList.unshift({
        testID: LightBoxDialogIds.CLOSE_DIALOG_BTN,
        text: 'CLOSE',
        styles: (theme: Theme, layout: Layout): ButtonStyles => {
          return fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
            ButtonSize.SMALL,
            theme,
            layout,
          );
        },
        onPress: this.props.close,
      });
    }

    return buttonList;
  }
}
