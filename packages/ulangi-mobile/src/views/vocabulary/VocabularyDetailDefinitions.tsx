/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableDefinition } from '@ulangi/ulangi-observable';
import { IObservableArray } from 'mobx';
import * as React from 'react';

import { SectionGroup } from '../section/SectionGroup';
import { DefinitionItem } from '../vocabulary/DefinitionItem';
import {
  VocabularyDetailDefinitionsStyles,
  darkStyles,
  definitionItemDarkStyles,
  definitionItemLightStyles,
  lightStyles,
} from './VocabularyDetailDefinitions.style';

export interface VocabularyDetailDefinitionsProps {
  theme: Theme;
  definitions: IObservableArray<ObservableDefinition>;
  styles?: {
    light: VocabularyDetailDefinitionsStyles;
    dark: VocabularyDetailDefinitionsStyles;
  };
}

export class VocabularyDetailDefinitions extends React.Component<
  VocabularyDetailDefinitionsProps
> {
  public get styles(): VocabularyDetailDefinitionsStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <SectionGroup theme={this.props.theme} header="DEFINITIONS">
        {this.props.definitions.map(
          (definition, index): React.ReactElement<any> => {
            return (
              <DefinitionItem
                theme={this.props.theme}
                key={definition.definitionId}
                index={index}
                definition={definition}
                styles={{
                  light: definitionItemLightStyles,
                  dark: definitionItemDarkStyles,
                }}
              />
            );
          }
        )}
      </SectionGroup>
    );
  }
}
