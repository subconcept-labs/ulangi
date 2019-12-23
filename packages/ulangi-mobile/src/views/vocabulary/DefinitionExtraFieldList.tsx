/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DefinitionExtraFieldDetails } from '@ulangi/ulangi-common/constants';
import { ExtraFieldDetail } from '@ulangi/ulangi-common/core';
import { Theme } from '@ulangi/ulangi-common/enums';
import { DefinitionExtraFields } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { VocabularyItemIds } from '../../constants/ids/VocabularyItemIds';
import { DefaultText } from '../common/DefaultText';
import { SmartScrollView } from '../common/SmartScrollView';
import {
  DefinitionExtraFieldListStyles,
  darkStyles,
  lightStyles,
} from './DefinitionExtraFieldList.style';

export interface DefinitionExtraFieldListProps {
  theme: Theme;
  extraFields: DefinitionExtraFields;
  hideFields?: (keyof DefinitionExtraFields)[];
  styles?: {
    light: DefinitionExtraFieldListStyles;
    dark: DefinitionExtraFieldListStyles;
  };
}

@observer
export class DefinitionExtraFieldList extends React.Component<
  DefinitionExtraFieldListProps
> {
  public get styles(): DefinitionExtraFieldListStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        {_.toPairs(this.props.extraFields)
          .filter(
            ([key, valueList]): boolean => {
              return (
                DefinitionExtraFieldDetails[key as keyof DefinitionExtraFields]
                  .parseDirection === 'right' &&
                valueList.length > 0 &&
                (typeof this.props.hideFields === 'undefined' ||
                  !_.includes(this.props.hideFields, key))
              );
            },
          )
          .map(
            ([key, valueList]): React.ReactElement<any> => {
              if (
                DefinitionExtraFieldDetails[key as keyof DefinitionExtraFields]
                  .templateName === 'image'
              ) {
                return this.renderFieldsByImage(
                  DefinitionExtraFieldDetails[
                    key as keyof DefinitionExtraFields
                  ],
                  valueList,
                );
              } else {
                return this.renderFieldsByText(
                  DefinitionExtraFieldDetails[
                    key as keyof DefinitionExtraFields
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
      <SmartScrollView
        horizontal={true}
        key={detail.name}
        contentContainerStyle={this.styles.image_list}>
        {valueList.map(
          (values): React.ReactElement<any> => {
            return (
              <View
                testID={VocabularyItemIds.DEFINITION_EXTRA_FIELD_BY_NAME_VALUE(
                  detail.name,
                  values[0],
                )}
                key={values[0]}
                style={this.styles.image_container}>
                <FastImage
                  style={this.styles.image}
                  source={{ uri: values[0] }}
                  resizeMode="contain"
                />
              </View>
            );
          },
        )}
      </SmartScrollView>
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
                testID={VocabularyItemIds.DEFINITION_EXTRA_FIELD_BY_NAME_VALUE(
                  detail.name,
                  values[0],
                )}
                key={values[0]}
                style={this.styles.field_container}>
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
              </View>
            );
          },
        )}
      </React.Fragment>
    );
  }
}
