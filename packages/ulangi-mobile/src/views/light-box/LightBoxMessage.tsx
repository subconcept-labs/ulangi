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
import { View } from 'react-native';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { DefaultText } from '../common/DefaultText';
import {
  LightBoxMessageStyles,
  lightBoxMessageResponsiveStyles,
} from './LightBoxMessage.style';

export interface LightBoxMessageProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  message: string;
}

@observer
export class LightBoxMessage extends React.Component<LightBoxMessageProps> {
  private get styles(): LightBoxMessageStyles {
    return lightBoxMessageResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.message_container}>
        <DefaultText
          testID={LightBoxDialogIds.DIALOG_MESSAGE}
          style={this.styles.message}>
          {this.props.message}
        </DefaultText>
      </View>
    );
  }
}
