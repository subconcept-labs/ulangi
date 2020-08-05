/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  VocabularyDetailPronunciationStyles,
  vocabularyDetailPronunciationResponsiveStyles,
} from './VocabularyDetailPronunciation.style';

export interface VocabularyDetailPronunciationProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  speakState: IObservableValue<ActivityState>;
  speak: () => void;
}

@observer
export class VocabularyDetailPronunciation extends React.Component<
  VocabularyDetailPronunciationProps
> {
  public get styles(): VocabularyDetailPronunciationStyles {
    return vocabularyDetailPronunciationResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <SectionGroup
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          header="PRONUNCIATION">
          <SectionRow
            theme={this.props.theme}
            screenLayout={this.props.screenLayout}
            leftText="Audio"
            rightIcon={this.renderSpeaker()}
          />
        </SectionGroup>
      </View>
    );
  }

  private renderSpeaker(): React.ReactElement<any> {
    if (this.props.speakState.get() === ActivityState.INACTIVE) {
      return (
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={this.styles.speak_touchable}
          onPress={this.props.speak}>
          <Image
            style={this.styles.speaker_icon}
            source={
              this.props.theme === Theme.LIGHT
                ? Images.SPEAKER_BLACK_16X16
                : Images.SPEAKER_MILK_16X16
            }
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <ActivityIndicator
          style={this.styles.activity_indicator}
          size="small"
        />
      );
    }
  }
}
