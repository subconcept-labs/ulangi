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
import { Image, View } from 'react-native';

import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';
import {
  WritingTitleStyles,
  writingTitleResponsiveStyles,
} from './WritingTitle.style';

export interface WritingTitleProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
}

@observer
export class WritingTitle extends React.Component<WritingTitleProps> {
  private get styles(): WritingTitleStyles {
    return writingTitleResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <DefaultText style={this.styles.title}>Writing</DefaultText>
        <DefaultText style={this.styles.subtitle}>
          WITH SPACED REPETITION
        </DefaultText>
        <Image source={Images.WRITING_30X30} style={this.styles.icon} />
      </View>
    );
  }
}
