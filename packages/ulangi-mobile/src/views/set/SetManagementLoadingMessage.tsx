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

import { DefaultText } from '../common/DefaultText';
import {
  SetManagementLoadingMessageStyles,
  setManagementLoadingMessageResponsiveStyles,
} from './SetManagementLoadingMessage.style';

export interface SetManagementLoadingMessageProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  loadingMessage: string;
}

@observer
export class SetManagementLoadingMessage extends React.Component<
  SetManagementLoadingMessageProps
> {
  private get styles(): SetManagementLoadingMessageStyles {
    return setManagementLoadingMessageResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.loading_message_container}>
        <DefaultText style={this.styles.loading_message}>
          {this.props.loadingMessage}
        </DefaultText>
      </View>
    );
  }
}
