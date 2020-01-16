/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableThemeStore } from '@ulangi/ulangi-observable';
import * as React from 'react';
import { View } from 'react-native';

import { WritingFAQScreenIds } from '../../constants/ids/WritingFAQScreenIds';
import { FAQList } from '../common/FAQList';
import {
  WritingFAQScreenStyles,
  darkStyles,
  lightStyles,
} from './WritingFAQScreen.style';

export interface WritingFAQScreenProps {
  themeStore: ObservableThemeStore;
}

export class WritingFAQScreen extends React.Component<WritingFAQScreenProps> {
  public get styles(): WritingFAQScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  private data = {
    sections: [
      {
        title: 'How does this work?',
        content:
          'In each writing session, you will be asked to write your terms given their definitions then provide feedback of how well you memorize them. The system will adjust level and schedule review time based on your feedback.',
      },
      {
        title: 'What algorithm are we using for scheduling?',
        content:
          'We are using the Leitner system algorithm. Each of your vocabulary term has a WR level. The higher the level is, the more time you have to wait to write it again.',
      },
    ],
  };

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.screen} testID={WritingFAQScreenIds.SCREEN}>
        <FAQList
          theme={this.props.themeStore.theme}
          sections={this.data.sections}
        />
      </View>
    );
  }
}
