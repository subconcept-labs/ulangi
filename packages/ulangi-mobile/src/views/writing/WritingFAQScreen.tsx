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
        title: 'Can I turn off error hinting?',
        content:
          "By default, if your answer is incorrect, it will show red underline. You can disable this by turning off 'Highlight on Error' in Settings.",
      },
      {
        title: 'Can I review without Internet connection?',
        content:
          'Once the assets (audios, images, etc) are downloaded, they will be stored locally for offline access. This means that to play an audio offline, you must play it at least once with Internet connection.',
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
