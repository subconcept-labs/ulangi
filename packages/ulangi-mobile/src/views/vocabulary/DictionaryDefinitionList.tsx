/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { Attribution } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableDictionaryDefinition,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { DictionaryDefinition } from './DictionaryDefinition';
import {
  DictionaryDefinitionListStyles,
  dictionaryDefinitionListResponsiveStyles,
} from './DictionaryDefinitionList.style';

export interface DictionaryDefinitionListProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  term: string;
  label?: string;
  attributions: undefined | Attribution[];
  definitions: readonly ObservableDictionaryDefinition[];
  onPick: (definition: ObservableDictionaryDefinition) => void;
  showLink: (link: string, screenTitle: string) => void;
}

@observer
export class DictionaryDefinitionList extends React.Component<
  DictionaryDefinitionListProps
> {
  public get styles(): DictionaryDefinitionListStyles {
    return dictionaryDefinitionListResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <React.Fragment>
        <View style={this.styles.title_container}>
          <DefaultText style={this.styles.title}>
            <DefaultText>Found </DefaultText>
            <DefaultText style={this.styles.term}>
              {this.props.term +
                (typeof this.props.label !== 'undefined'
                  ? ` (${this.props.label})`
                  : '')}
            </DefaultText>
            {typeof this.props.attributions !== 'undefined'
              ? this.renderAttributions(this.props.attributions)
              : null}
          </DefaultText>
        </View>
        {this.props.definitions.map(
          (definition, index): React.ReactElement<any> => {
            return (
              <DictionaryDefinition
                key={index}
                theme={this.props.theme}
                screenLayout={this.props.screenLayout}
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

  private renderAttributions(
    attributions: Attribution[],
  ): React.ReactElement<any> {
    return (
      <DefaultText>
        <DefaultText> from </DefaultText>
        {attributions.map(
          (attribution, index): React.ReactElement<any> => {
            return (
              <DefaultText key={attribution.sourceName}>
                {index > 0 ? <DefaultText>, </DefaultText> : null}
                <DefaultText
                  onPress={(): void => {
                    if (typeof attribution.sourceLink !== 'undefined') {
                      this.props.showLink(
                        attribution.sourceLink,
                        attribution.sourceName,
                      );
                    }
                  }}
                  style={
                    attribution.sourceLink ? this.styles.hightlighted : null
                  }>
                  {attribution.sourceName}
                </DefaultText>
                {typeof attribution.license !== 'undefined' ? (
                  <DefaultText style={this.styles.license_text}>
                    <DefaultText>, under </DefaultText>
                    <DefaultText
                      style={this.styles.hightlighted}
                      onPress={(): void => {
                        if (typeof attribution.licenseLink !== 'undefined') {
                          this.props.showLink(
                            attribution.licenseLink,
                            'License',
                          );
                        }
                      }}>
                      {attribution.license}
                    </DefaultText>
                  </DefaultText>
                ) : null}
              </DefaultText>
            );
          },
        )}
      </DefaultText>
    );
  }
}
