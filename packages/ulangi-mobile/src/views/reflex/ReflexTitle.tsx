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
  ReflexTitleStyles,
  reflexTitleResponsiveStyles,
} from './ReflexTitle.style';

export interface ReflexTitleProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
}

@observer
export class ReflexTitle extends React.Component<ReflexTitleProps> {
  private get styles(): ReflexTitleStyles {
    return reflexTitleResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <DefaultText allowFontScaling={false} style={this.styles.title}>
          REFLEX
        </DefaultText>
      </View>
    );
  }
}
