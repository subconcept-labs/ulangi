/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import * as changeCase from 'change-case';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  LightBoxTitleStyles,
  lightBoxTitleResponsiveStyles,
} from './LightBoxTitle.style';

export interface LightBoxTitleProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  title: string;
}

export class LightBoxTitle extends React.Component<LightBoxTitleProps> {
  public get styles(): LightBoxTitleStyles {
    return lightBoxTitleResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.title_container}>
        <DefaultText style={this.styles.title_text}>
          {changeCase.upper(this.props.title)}
        </DefaultText>
      </View>
    );
  }
}
