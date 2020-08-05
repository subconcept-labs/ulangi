/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDefinition,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { DefinitionItem } from './DefinitionItem';
import {
  DefinitionListStyles,
  definitionListResponsiveStyles,
} from './DefinitionList.style';

export interface DefinitionListProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  definitions: ObservableDefinition[];
  styles?: {
    light: DefinitionListStyles;
    dark: DefinitionListStyles;
  };
}

export class DefinitionList extends React.Component<DefinitionListProps> {
  public get styles(): DefinitionListStyles {
    return definitionListResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.definition_list}>
        {this.props.definitions.length > 0 ? (
          this.props.definitions.map(
            (definition, index): React.ReactElement<any> => {
              return (
                <DefinitionItem
                  theme={this.props.theme}
                  screenLayout={this.props.screenLayout}
                  key={definition.definitionId}
                  index={index}
                  definition={definition}
                />
              );
            },
          )
        ) : (
          <View style={this.styles.missing_definitions_container}>
            <DefaultText style={this.styles.missing_definitions}>
              Missing definitions!
            </DefaultText>
          </View>
        )}
      </View>
    );
  }
}
