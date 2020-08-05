/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { DiscoverFAQScreenIds } from '../../constants/ids/DiscoverFAQScreenIds';
import { DefaultText } from '../common/DefaultText';
import { FAQList } from '../common/FAQList';
import { Screen } from '../common/Screen';
import {
  DiscoverFAQScreenStyles,
  discoverFAQScreenResponsiveStyles,
} from './DiscoverFAQScreen.style';

export interface DiscoverFAQScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableScreen;
}

@observer
export class DiscoverFAQScreen extends React.Component<DiscoverFAQScreenProps> {
  public get styles(): DiscoverFAQScreenStyles {
    return discoverFAQScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
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
      <Screen
        style={this.styles.screen}
        testID={DiscoverFAQScreenIds.SCREEN}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        <FAQList
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          sections={this.data.sections}
        />
      </Screen>
    );
  }
}
