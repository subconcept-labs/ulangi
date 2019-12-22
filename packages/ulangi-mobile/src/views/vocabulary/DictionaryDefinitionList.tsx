/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { Theme } from '@ulangi/ulangi-common/enums';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import { ObservableDictionaryDefinition } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';
import { DictionaryDefinition } from './DictionaryDefinition';
import {
  DictionaryDefinitionListStyles,
  darkStyles,
  lightStyles,
} from './DictionaryDefinitionList.style';

export interface DictionaryDefinitionListProps {
  theme: Theme;
  term: string;
  formattedSource: string;
  license: string;
  definitions: readonly ObservableDictionaryDefinition[];
  onPick: (definition: DeepPartial<Definition>) => void;
  openSourceLink: () => void;
  styles?: {
    light: DictionaryDefinitionListStyles;
    dark: DictionaryDefinitionListStyles;
  };
}

@observer
export class DictionaryDefinitionList extends React.Component<
  DictionaryDefinitionListProps
> {
  public get styles(): DictionaryDefinitionListStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <React.Fragment>
        <View style={this.styles.source_container}>
          <View style={this.styles.source_left}>
            <TouchableOpacity
              style={this.styles.link_container}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={this.props.openSourceLink}
            >
              <DefaultText style={this.styles.source_text}>
                {this.props.formattedSource}
              </DefaultText>
              <Image
                style={this.styles.link_icon}
                source={Images.LINK_GREY_14X14}
              />
            </TouchableOpacity>
          </View>
          <DefaultText style={this.styles.license_text}>
            {this.props.license}
          </DefaultText>
        </View>
        {this.props.definitions.map(
          (definition, index): React.ReactElement<any> => {
            return (
              <DictionaryDefinition
                key={index}
                theme={this.props.theme}
                index={index}
                definition={definition}
                onPick={this.props.onPick}
              />
            );
          }
        )}
      </React.Fragment>
    );
  }
}
