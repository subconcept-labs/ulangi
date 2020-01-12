/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyExtraFieldDetails } from '@ulangi/ulangi-common/constants';
import { ExtraFieldDetail } from '@ulangi/ulangi-common/core';
import { ActivityState, Theme } from '@ulangi/ulangi-common/enums';
import { VocabularyExtraFields } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import { Images } from '../../constants/Images';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  VocabularyDetailExtraFieldsStyles,
  darkStyles,
  lightStyles,
} from './VocabularyDetailExtraFields.style';

export interface VocabularyDetailExtraFieldsProps {
  theme: Theme;
  vocabularyExtraFields: VocabularyExtraFields;
  speakState: IObservableValue<ActivityState>;
  speak: (text: string) => void;
  styles?: {
    light: VocabularyDetailExtraFieldsStyles;
    dark: VocabularyDetailExtraFieldsStyles;
  };
}

@observer
export class VocabularyDetailExtraFields extends React.Component<
  VocabularyDetailExtraFieldsProps
> {
  public get styles(): VocabularyDetailExtraFieldsStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): null | React.ReactElement<any> {
    if (
      _.every(
        this.props.vocabularyExtraFields,
        (valueList): boolean => {
          return valueList.length === 0;
        },
      ) === true
    ) {
      return null;
    } else {
      return (
        <SectionGroup theme={this.props.theme} header="EXTRA FIELDS">
          {_.toPairs(this.props.vocabularyExtraFields).map(
            ([key, valueList]): React.ReactElement<any> => {
              if (
                VocabularyExtraFieldDetails[key as keyof VocabularyExtraFields]
                  .templateName === 'image'
              ) {
                return this.renderFieldsByImage(
                  VocabularyExtraFieldDetails[
                    key as keyof VocabularyExtraFields
                  ],
                  valueList,
                );
              } else {
                return this.renderFieldsByText(
                  VocabularyExtraFieldDetails[
                    key as keyof VocabularyExtraFields
                  ],
                  valueList,
                );
              }
            },
          )}
        </SectionGroup>
      );
    }
  }

  private renderFieldsByImage(
    detail: ExtraFieldDetail,
    valueList: readonly string[][],
  ): React.ReactElement<any> {
    return (
      <React.Fragment key={detail.name}>
        {valueList.map(
          (values): React.ReactElement<any> => {
            return (
              <SectionRow
                key={values[0]}
                theme={this.props.theme}
                leftText={detail.name}
                customRight={
                  <FastImage
                    style={this.styles.image}
                    source={{ uri: values[0] }}
                    resizeMode="contain"
                  />
                }
              />
            );
          },
        )}
      </React.Fragment>
    );
  }

  private renderFieldsByText(
    detail: ExtraFieldDetail,
    valueList: readonly string[],
  ): React.ReactElement<any> {
    return (
      <React.Fragment key={detail.name}>
        {valueList.map(
          (values): React.ReactElement<any> => {
            return (
              <SectionRow
                theme={this.props.theme}
                key={values[0]}
                leftText={detail.name}
                rightText={values[0]}
                rightIcon={
                  detail.params[0].isSpeakable === true
                    ? this.renderSpeaker(values[0])
                    : undefined
                }
                shrink="left"
              />
            );
          },
        )}
      </React.Fragment>
    );
  }

  private renderSpeaker(value: string): React.ReactElement<any> {
    if (this.props.speakState.get() === ActivityState.INACTIVE) {
      return (
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={this.styles.speak_touchable}
          onPress={(): void => this.props.speak(value)}>
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
