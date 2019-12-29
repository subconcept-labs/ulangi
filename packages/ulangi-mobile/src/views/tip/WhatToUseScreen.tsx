/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableDarkModeStore } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { WhatToUseScreenIds } from '../../constants/ids/WhatToUseScreenIds';
import { WhatToUseScreenDelegate } from '../../delegates/tip/WhatToUseScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import {
  WhatToUseScreenStyles,
  darkStyles,
  lightStyles,
} from './WhatToUseScreen.style';

export interface WhatToUseScreenProps {
  darkModeStore: ObservableDarkModeStore;
  screenDelegate: WhatToUseScreenDelegate;
}

@observer
export class WhatToUseScreen extends React.Component<WhatToUseScreenProps> {
  public get styles(): WhatToUseScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.screen} testID={WhatToUseScreenIds.SCREEN}>
        <ScrollView
          style={this.styles.scroll_view_container}
          contentContainerStyle={this.styles.content_container}>
          <View style={this.styles.paragraph}>
            <DefaultText style={this.styles.title}>
              RECOMMENDED FEATURES TO USE
            </DefaultText>
            <DefaultText style={this.styles.text}>
              <DefaultText style={this.styles.bold}>
                • Spaced Repetition
              </DefaultText>{' '}
              provides an origanized and quick way to memorize and review terms.
              It takes a short time to complete a lesson.
              <DefaultText
                style={this.styles.highlighted}
                onPress={this.props.screenDelegate.showSpacedRepetitionWiki}>
                {' '}
                Read more about Spaced repetition on Wikipedia.
              </DefaultText>
            </DefaultText>
            <DefaultText style={this.styles.text}>
              <DefaultText style={this.styles.bold}>• Writing</DefaultText>{' '}
              allows you to memorize terms more effectively by actively writing
              them.
            </DefaultText>
            <DefaultText style={this.styles.text}>
              <DefaultText style={this.styles.bold}>
                • Both techniques
              </DefaultText>{' '}
              use the{' '}
              <DefaultText
                style={this.styles.highlighted}
                onPress={this.props.screenDelegate.showSpacedRepetitionWiki}>
                Leitner system
              </DefaultText>{' '}
              for efficient scheduling.
            </DefaultText>
          </View>
          <View style={this.styles.paragraph}>
            <DefaultText style={this.styles.title}>
              OPTIONAL FEATURES TO USE
            </DefaultText>
            <DefaultText style={this.styles.text}>
              <DefaultText style={this.styles.bold}>• Quiz</DefaultText> is
              designed to test what you learned only. Quiz result does not
              contribute towards your learning progress. In other words, it does
              not affect term levels.
            </DefaultText>
            <DefaultText style={this.styles.text}>
              <DefaultText style={this.styles.bold}>• Games</DefaultText> are
              created for you to practice your terms with fun. Similar to Quiz,
              they do not affect term levels.
            </DefaultText>
          </View>
          <View style={this.styles.paragraph}>
            <DefaultText style={this.styles.title}>
              DESIGN YOUR DAILY ROUTINE
            </DefaultText>
            <DefaultText style={this.styles.text}>
              • <DefaultText style={this.styles.bold}>Ulangi</DefaultText>
              {
                ' gives you flexibilty to design your own daily routine in such a way to achieve comfortable and effective learning experience. For example, if you decide to take 5 Spaced Repetition lessons and 2 Writing lessons each day, you will review as many as 42 terms per day.'
              }
            </DefaultText>
            <DefaultText style={this.styles.text}>
              •{' '}
              <DefaultText style={this.styles.bold}>
                Unlike most apps
              </DefaultText>
              , we do not recommend users to review all due terms or as many as
              possible in one day because it is counter-productive. If you find
              yourself forgetting too many learned terms during a review, we
              suggest you to lower the number of lessons you take per day.
            </DefaultText>
            <DefaultText style={this.styles.text}>
              •{' '}
              <DefaultText style={this.styles.bold}>In the future</DefaultText>,
              we will predict how many terms you will master based on your daily
              routine.
            </DefaultText>
          </View>
        </ScrollView>
      </View>
    );
  }
}
