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

import { WritingFAQScreenIds } from '../../constants/ids/WritingFAQScreenIds';
import { FAQList } from '../common/FAQList';
import { Screen } from '../common/Screen';
import {
  WritingFAQScreenStyles,
  writingFAQScreenResponsiveStyles,
} from './WritingFAQScreen.style';

export interface WritingFAQScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableScreen;
}

@observer
export class WritingFAQScreen extends React.Component<WritingFAQScreenProps> {
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
      {
        title: 'Can I review without Internet connection?',
        content:
          'Once assets (audios or images) are downloaded, they will be stored locally for offline access. This means that to play an audio offline, you must play it at least once with Internet connection.',
      },
    ],
  };

  private get styles(): WritingFAQScreenStyles {
    return writingFAQScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={WritingFAQScreenIds.SCREEN}
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
