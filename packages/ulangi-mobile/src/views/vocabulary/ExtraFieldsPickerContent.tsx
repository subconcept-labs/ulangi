/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  DefinitionExtraFieldDetails,
  VocabularyExtraFieldDetails,
} from '@ulangi/ulangi-common/constants';
import { ExtraFieldDetail } from '@ulangi/ulangi-common/core';
import { Theme } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DefaultText } from '../common/DefaultText';
import { SmartScrollView } from '../common/SmartScrollView';
import {
  ExtraFieldsPickerContentStyles,
  darkStyles,
  lightStyles,
} from './ExtraFieldsPickerContent.style';

export interface ExtraFieldsPickerContentProps {
  theme: Theme;
  kind: 'vocabulary' | 'definition';
  learningLanguageCode: string;
  selectImages: () => void;
  onPick: (
    extraFieldDetail: ExtraFieldDetail,
    value: string,
    cursor: undefined | number
  ) => void;
  styles?: {
    light: ExtraFieldsPickerContentStyles;
    dark: ExtraFieldsPickerContentStyles;
  };
}

@observer
export class ExtraFieldsPickerContent extends React.Component<
  ExtraFieldsPickerContentProps
> {
  public get styles(): ExtraFieldsPickerContentStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <SmartScrollView
        testID={VocabularyFormIds.EXTRA_FIELD_LIST}
        showsVerticalScrollIndicator={true}
        style={this.styles.picker_content}
      >
        {this.renderExtraFields(
          this.props.kind === 'vocabulary'
            ? VocabularyExtraFieldDetails
            : DefinitionExtraFieldDetails
        )}
      </SmartScrollView>
    );
  }

  private renderExtraFields(
    extraFieldDetails: { [P in keyof any]: ExtraFieldDetail }
  ): React.ReactElement<any> {
    return (
      <React.Fragment>
        {_.toPairs(extraFieldDetails)
          .filter(
            ([, detail]): boolean => {
              return (
                detail.targetLanguageCodes === 'any' ||
                _.includes(
                  detail.targetLanguageCodes,
                  this.props.learningLanguageCode
                )
              );
            }
          )
          .map(
            ([key, detail]): React.ReactElement<any> => {
              return this.renderRow(key, detail);
            }
          )}
      </React.Fragment>
    );
  }

  private renderRow(
    key: string,
    detail: ExtraFieldDetail
  ): React.ReactElement<any> {
    return (
      <View key={key} style={this.styles.row}>
        <View style={this.styles.left}>
          <DefaultText style={this.styles.name}>{detail.name}</DefaultText>
          <DefaultText style={this.styles.note}>
            Must be {detail.parseDirection === 'left' ? 'before' : 'after'} the{' '}
            {detail.kind}
          </DefaultText>
        </View>
        <View style={this.styles.right}>{this.renderButtons(detail)}</View>
      </View>
    );
  }

  private renderButtons(detail: ExtraFieldDetail): React.ReactElement<any> {
    return (
      <View style={this.styles.btn_container}>
        {detail.templateName === 'image'
          ? this.renderButton(
              'Select images',
              (): void => {
                this.props.selectImages();
              }
            )
          : null}
        {detail.shortcodes.map(
          (shortcode): React.ReactElement<any> => {
            return this.renderButton(
              `+ ${shortcode.value}`,
              (): void => {
                this.props.onPick(detail, shortcode.value, shortcode.cursor);
              }
            );
          }
        )}
      </View>
    );
  }

  private renderButton(
    text: string,
    onPress: () => void
  ): React.ReactElement<any> {
    return (
      <TouchableOpacity
        key={text}
        testID={VocabularyFormIds.ADD_EXTRA_FIELD_BTN_BY_TEXT(text)}
        style={this.styles.btn}
        onPress={onPress}
      >
        <DefaultText style={this.styles.btn_text}>{text}</DefaultText>
      </TouchableOpacity>
    );
  }
}
