/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableThemeStore } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DiscoverFAQScreenIds } from '../../constants/ids/DiscoverFAQScreenIds';
import { DefaultText } from '../common/DefaultText';
import { FAQList } from '../common/FAQList';
import {
  DiscoverFAQScreenStyles,
  darkStyles,
  lightStyles,
} from './DiscoverFAQScreen.style';

export interface DiscoverFAQScreenProps {
  themeStore: ObservableThemeStore;
}

@observer
export class DiscoverFAQScreen extends React.Component<DiscoverFAQScreenProps> {
  public get styles(): DiscoverFAQScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  private data = {
    sections: [
      {
        title: 'Search dictionary entries',
        content: (
          <DefaultText>
            You can search for a dictionary entry by entering either its term or
            definition.
          </DefaultText>
        ),
      },
      {
        title: 'Search categories',
        content: (
          <DefaultText>
            You can search for a category to find all related terms (e.g. type
            Animails to see all Animal terms.)
          </DefaultText>
        ),
      },
      {
        title: 'Built-in translator',
        content: (
          <DefaultText>
            Ulangi comes with Google Translate. You can translate a phrase or
            sentence into your learning language or vice versa.
          </DefaultText>
        ),
      },
      {
        title: 'Duplicate prevention',
        content: (
          <DefaultText>
            By default, Ulangi will alert you when you add the same term again.
          </DefaultText>
        ),
      },
    ],
  };

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.screen} testID={DiscoverFAQScreenIds.SCREEN}>
        <FAQList
          theme={this.props.themeStore.theme}
          sections={this.data.sections}
        />
      </View>
    );
  }
}
