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

import { SpacedRepetitionFAQScreenIds } from '../../constants/ids/SpacedRepetitionFAQScreenIds';
import { SpacedRepetitionFAQScreenDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionFAQScreenDelegate';
import { FAQList } from '../common/FAQList';
import { Screen } from '../common/Screen';
import {
  SpacedRepetitionFAQScreenStyles,
  spacedRepetitionFAQScreenResponsiveStyles,
} from './SpacedRepetitionFAQScreen.style';

export interface SpacedRepetitionFAQScreenProps {
  observableScreen: ObservableScreen;
  themeStore: ObservableThemeStore;
  screenDelegate: SpacedRepetitionFAQScreenDelegate;
}

@observer
export class SpacedRepetitionFAQScreen extends React.Component<
  SpacedRepetitionFAQScreenProps
> {
  public get styles(): SpacedRepetitionFAQScreenStyles {
    return spacedRepetitionFAQScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  private data = {
    sections: [
      {
        title: 'How does Spaced Repetition work?',
        content:
          'In each review session, you will review the cards and provide feedback of how well you memorize them. The system will schedule review based on your feedback. With this scheduling system, it helps you to achieve spacing effects and reduce unnecessary reviews (repetitions).',
      },
      {
        title: 'Can I review my cards in both directions?',
        content:
          'By default, the app automatically switches review direction for you. You can also adjust this by selecting a Review Strategy option in Settings.',
      },
      {
        title: 'Can I learn new cards even if I have due ones to review?',
        content:
          'By default, the system prioritizes due cards over new ones. You can change this priority by selecting a Review Priority option in Settings.',
      },
      {
        title: 'Can I review without Internet connection?',
        content:
          'Once the assets (audios, images, etc) are downloaded, they will be stored locally for offline access. This means that to play an audio offline, you must play it at least once with Internet connection.',
      },
    ],
  };

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={SpacedRepetitionFAQScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <FAQList
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          sections={this.data.sections}
        />
      </Screen>
    );
  }
}
