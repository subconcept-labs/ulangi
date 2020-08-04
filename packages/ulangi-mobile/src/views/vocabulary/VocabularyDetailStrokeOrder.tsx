/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { VocabularyExtraFields } from '@ulangi/ulangi-common/interfaces';
import { ObservableDimensions } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import { StrokeOrders } from '../vocabulary/StrokeOrders';
import {
  VocabularyDetailStrokeOrderStyles,
  darkStyles,
  lightStyles,
} from './VocabularyDetailStrokeOrder.style';

export interface VocabularyDetailStrokeOrderProps {
  theme: Theme;
  observableDimensions: ObservableDimensions;
  vocabularyTerm: string;
  vocabularyExtraFields: VocabularyExtraFields;
  strokeOrderForm: 'traditional' | 'simplified' | 'unknown';
  changeStrokeOrderForm: (
    form: 'traditional' | 'simplified' | 'unknown',
  ) => void;
  styles?: {
    light: VocabularyDetailStrokeOrderStyles;
    dark: VocabularyDetailStrokeOrderStyles;
  };
}

@observer
export class VocabularyDetailStrokeOrder extends React.Component<
  VocabularyDetailStrokeOrderProps
> {
  public get styles(): VocabularyDetailStrokeOrderStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <SectionGroup theme={this.props.theme} header="STROKE ORDERS">
        <SectionRow
          theme={this.props.theme}
          leftText="Tap character to show"
          description={
            <View style={this.styles.container}>
              <StrokeOrders
                theme={this.props.theme}
                observableDimensions={this.props.observableDimensions}
                words={
                  this.props.strokeOrderForm === 'traditional'
                    ? this.props.vocabularyExtraFields.traditional[0][0].split(
                        '',
                      )
                    : this.props.strokeOrderForm === 'simplified'
                    ? this.props.vocabularyExtraFields.simplified[0][0].split(
                        '',
                      )
                    : this.props.vocabularyTerm.split('')
                }
              />
              {this.renderChangeStrokOrderButton()}
            </View>
          }
        />
      </SectionGroup>
    );
  }

  private renderChangeStrokOrderButton(): React.ReactElement<any> {
    return (
      <View>
        {this.props.strokeOrderForm === 'unknown' &&
        this.props.vocabularyExtraFields.traditional.length > 0 ? (
          <TouchableOpacity
            onPress={(): void => {
              this.props.changeStrokeOrderForm('traditional');
            }}>
            <DefaultText style={this.styles.button_text}>
              View traditional
            </DefaultText>
          </TouchableOpacity>
        ) : null}
        {this.props.strokeOrderForm === 'unknown' &&
        this.props.vocabularyExtraFields.simplified.length > 0 ? (
          <TouchableOpacity
            onPress={(): void => {
              this.props.changeStrokeOrderForm('simplified');
            }}>
            <DefaultText style={this.styles.button_text}>
              View simplified
            </DefaultText>
          </TouchableOpacity>
        ) : null}
        {this.props.strokeOrderForm !== 'unknown' ? (
          <TouchableOpacity
            onPress={(): void => {
              this.props.changeStrokeOrderForm('unknown');
            }}>
            <DefaultText style={this.styles.button_text}>Back</DefaultText>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}
