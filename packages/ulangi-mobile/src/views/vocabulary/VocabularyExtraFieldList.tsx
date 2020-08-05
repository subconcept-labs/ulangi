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
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { Images } from '../../constants/Images';
import { VocabularyItemIds } from '../../constants/ids/VocabularyItemIds';
import { DefaultActivityIndicator } from '../common/DefaultActivityIndicator';
import { DefaultText } from '../common/DefaultText';
import {
  VocabularyExtraFieldListStyles,
  vocabularyExtraFieldListResponsiveStyles,
} from './VocabularyExtraFieldList.style';

export interface VocabularyExtraFieldListProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  extraFields: VocabularyExtraFields;
  speakState?: IObservableValue<ActivityState>;
  speak?: (text: string) => void;
  styles?: {
    light: VocabularyExtraFieldListStyles;
    dark: VocabularyExtraFieldListStyles;
  };
}

@observer
export class VocabularyExtraFieldList extends React.Component<
  VocabularyExtraFieldListProps
> {
  public get styles(): VocabularyExtraFieldListStyles {
    return vocabularyExtraFieldListResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        {_.toPairs(this.props.extraFields)
          .filter(
            ([, valueList]): boolean => {
              return valueList.length > 0;
            },
          )
          .map(
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
      </View>
    );
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
              <View
                key={values[0]}
                style={this.styles.item_container}
                testID={VocabularyItemIds.VOCABULARY_EXTRA_FIELD_BY_NAME_VALUE(
                  detail.name,
                  values[0],
                )}>
                <View style={this.styles.left}>
                  <DefaultText style={this.styles.name}>{`${
                    detail.name
                  }: `}</DefaultText>
                </View>
                <View style={this.styles.right}>
                  <FastImage
                    style={this.styles.image}
                    source={{ uri: values[0] }}
                    resizeMode="contain"
                  />
                </View>
              </View>
            );
          },
        )}
      </React.Fragment>
    );
  }

  private renderFieldsByText(
    detail: ExtraFieldDetail,
    valueList: readonly string[][],
  ): React.ReactElement<any> {
    return (
      <React.Fragment key={detail.name}>
        {valueList.map(
          (values): React.ReactElement<any> => {
            return (
              <View
                key={values[0]}
                style={this.styles.item_container}
                testID={VocabularyItemIds.VOCABULARY_EXTRA_FIELD_BY_NAME_VALUE(
                  detail.name,
                  values[0],
                )}>
                <View style={this.styles.left}>
                  <DefaultText>
                    <DefaultText style={this.styles.name}>{`${
                      detail.name
                    }: `}</DefaultText>
                    <DefaultText style={this.styles.value}>
                      {values[0]}
                    </DefaultText>
                  </DefaultText>
                </View>
                {typeof this.props.speak !== 'undefined' &&
                detail.params[0].isSpeakable === true ? (
                  <View style={this.styles.right}>
                    {this.renderSpeaker(values[0])}
                  </View>
                ) : null}
              </View>
            );
          },
        )}
      </React.Fragment>
    );
  }

  private renderSpeaker(value: string): null | React.ReactElement<any> {
    if (
      typeof this.props.speakState !== 'undefined' &&
      this.props.speakState.get() === ActivityState.INACTIVE
    ) {
      return (
        <DefaultActivityIndicator
          activityState={this.props.speakState}
          style={this.styles.activity_indicator}
          size="small"
        />
      );
    } else if (typeof this.props.speak !== 'undefined') {
      const speak = this.props.speak;
      return (
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={this.styles.speak_touchable}
          onPress={(): void => speak(value)}>
          <Image
            style={this.styles.speaker_icon}
            source={Images.SPEAKER_BLACK_16X16}
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }
}
