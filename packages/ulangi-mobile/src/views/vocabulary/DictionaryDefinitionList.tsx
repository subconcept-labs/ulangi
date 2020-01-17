/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { Theme } from '@ulangi/ulangi-common/enums';
import { Attribution, Definition } from '@ulangi/ulangi-common/interfaces';
import { ObservableDictionaryDefinition } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

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
  attribution: Attribution;
  definitions: readonly ObservableDictionaryDefinition[];
  onPick: (definition: DeepPartial<Definition>) => void;
  openLink: (link: string) => void;
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
            <DefaultText style={this.styles.source_text}>
              <DefaultText>From </DefaultText>
              <DefaultText
                onPress={(): void => {
                  if (
                    typeof this.props.attribution.sourceLink !== 'undefined'
                  ) {
                    this.props.openLink(this.props.attribution.sourceLink);
                  }
                }}
                style={
                  this.props.attribution.sourceLink
                    ? this.styles.hightlighted
                    : null
                }>
                {this.props.attribution.sourceName}
              </DefaultText>
            </DefaultText>
            {typeof this.props.attribution.license !== 'undefined' ? (
              <DefaultText style={this.styles.license_text}>
                <DefaultText>, under </DefaultText>
                <DefaultText
                  style={this.styles.hightlighted}
                  onPress={(): void => {
                    if (
                      typeof this.props.attribution.licenseLink !== 'undefined'
                    ) {
                      this.props.openLink(this.props.attribution.licenseLink);
                    }
                  }}>
                  {this.props.attribution.license}
                </DefaultText>
              </DefaultText>
            ) : null}
          </View>
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
          },
        )}
      </React.Fragment>
    );
  }
}
