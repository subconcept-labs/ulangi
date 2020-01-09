/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableVocabularyDetailScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  VocabularyDetailPronunciationStyles,
  darkStyles,
  lightStyles,
} from './VocabularyDetailPronunciation.style';

export interface VocabularyDetailPronunciationProps {
  theme: Theme;
  observableScreen: ObservableVocabularyDetailScreen;
  speak: () => void;
  styles?: {
    light: VocabularyDetailPronunciationStyles;
    dark: VocabularyDetailPronunciationStyles;
  };
}

@observer
export class VocabularyDetailPronunciation extends React.Component<
  VocabularyDetailPronunciationProps
> {
  public get styles(): VocabularyDetailPronunciationStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <SectionGroup theme={this.props.theme} header="PRONUNCIATION">
          <SectionRow
            theme={this.props.theme}
            leftText="Audio"
            rightIcon={this.renderSpeaker()}
          />
        </SectionGroup>
      </View>
    );
  }

  private renderSpeaker(): React.ReactElement<any> {
    if (
      this.props.observableScreen.speakState.get() === ActivityState.INACTIVE
    ) {
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
