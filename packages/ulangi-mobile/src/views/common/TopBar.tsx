/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { TopBarStyles, darkStyles, lightStyles } from './TopBar.style';

export interface TopBarProps {
  theme: Theme;
  styles?: {
    light: TopBarStyles;
    dark: TopBarStyles;
  };
}

@observer
export class TopBar extends React.Component<TopBarProps> {
  public get styles(): TopBarStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.top_bar_container}>{this.props.children}</View>
    );
  }
}
