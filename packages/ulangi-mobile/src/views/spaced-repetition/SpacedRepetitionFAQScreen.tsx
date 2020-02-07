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

import { SpacedRepetitionFAQScreenIds } from '../../constants/ids/SpacedRepetitionFAQScreenIds';
import { SpacedRepetitionFAQScreenDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionFAQScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { FAQList } from '../common/FAQList';
import {
  SpacedRepetitionFAQScreenStyles,
  darkStyles,
  lightStyles,
} from './SpacedRepetitionFAQScreen.style';

export interface SpacedRepetitionFAQScreenProps {
  themeStore: ObservableThemeStore;
  screenDelegate: SpacedRepetitionFAQScreenDelegate;
}

@observer
export class SpacedRepetitionFAQScreen extends React.Component<
  SpacedRepetitionFAQScreenProps
> {
  public get styles(): SpacedRepetitionFAQScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  private data = {
    sections: [
      {
        title: 'Why should we use Spaced repetition?',
        content: (
          <DefaultText>
            <DefaultText>
              Spaced repetition helps you memorize a great number of terms by
              increasing intervals between review sessions. This gives you an
              organized learning pattern so it can save you time and allow you
              to learn more.
            </DefaultText>
            <DefaultText
              style={this.styles.highlighted}
              onPress={this.props.screenDelegate.showSpacedRepetitionWiki}>
              {' '}
              Read more about Spaced repetition on Wikipedia.
            </DefaultText>
          </DefaultText>
        ),
      },
      {
        title: 'How does Spaced repetition work?',
        content:
          'In each review session, you will be asked to review a certain number of terms then provide feedback of how well you memorize them. The system will adjust level and schedule review time based on your feedback.',
      },
      {
        title: 'What SR algorithm are we using?',
        content: (
          <DefaultText>
            We are using the{' '}
            <DefaultText
              style={this.styles.highlighted}
              onPress={this.props.screenDelegate.showLeitnerSystemWiki}>
              Leitner system algorithm
            </DefaultText>{' '}
            for scheduling. Each of your vocabulary term has a SR level. The
            higher the level is, the more time you have to wait to review it
            again.
          </DefaultText>
        ),
      },
      {
        title: 'Can I review without Internet connection?',
        content:
          'Once assets (audios or images) are downloaded, they will be stored locally for offline access. This means that to play an audio offline, you must play it at least once with Internet connection.',
      },
    ],
  };

  public render(): React.ReactElement<any> {
    return (
      <View
        style={this.styles.screen}
        testID={SpacedRepetitionFAQScreenIds.SCREEN}>
        <FAQList
          theme={this.props.themeStore.theme}
          sections={this.data.sections}
        />
      </View>
    );
  }
}
