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
import { IObservableArray } from 'mobx';
import * as React from 'react';

import { SectionGroup } from '../section/SectionGroup';
import { DefinitionItem } from '../vocabulary/DefinitionItem';
import {
  VocabularyDetailDefinitionsStyles,
  definitionItemResponsiveStyles,
  vocabularyDetailDefinitionsResponsiveStyles,
} from './VocabularyDetailDefinitions.style';

export interface VocabularyDetailDefinitionsProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  definitions: IObservableArray<ObservableDefinition>;
}

export class VocabularyDetailDefinitions extends React.Component<
  VocabularyDetailDefinitionsProps
> {
  public get styles(): VocabularyDetailDefinitionsStyles {
    return vocabularyDetailDefinitionsResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.theme}
        screenLayout={this.props.screenLayout}
        header="DEFINITIONS">
        {this.props.definitions.map(
          (definition, index): React.ReactElement<any> => {
            return (
              <DefinitionItem
                theme={this.props.theme}
                screenLayout={this.props.screenLayout}
                key={definition.definitionId}
                index={index}
                definition={definition}
                styles={definitionItemResponsiveStyles}
              />
            );
          },
        )}
      </SectionGroup>
    );
  }
}
