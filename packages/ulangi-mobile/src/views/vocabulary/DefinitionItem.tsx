/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { DefinitionExtraFields } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableDefinition,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { VocabularyItemIds } from '../../constants/ids/VocabularyItemIds';
import { DefaultText } from '../common/DefaultText';
import { DefinitionExtraFieldList } from './DefinitionExtraFieldList';
import {
  DefinitionItemResponsiveStyles,
  DefinitionItemStyles,
  definitionItemResponsiveStyles,
} from './DefinitionItem.style';
import { WordClassList } from './WordClassList';

export interface DefinitionItemProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  index: number;
  definition: ObservableDefinition;
  hideFields?: (keyof DefinitionExtraFields)[];
  styles?: DefinitionItemResponsiveStyles;
}

@observer
export class DefinitionItem extends React.Component<DefinitionItemProps> {
  private get styles(): DefinitionItemStyles {
    return this.props.styles
      ? this.props.styles.compile(this.props.screenLayout, this.props.theme)
      : definitionItemResponsiveStyles.compile(
          this.props.screenLayout,
          this.props.theme,
        );
  }

  public render(): React.ReactElement<any> {
    return (
      <View
        style={this.styles.item_container}
        testID={VocabularyItemIds.DEFINITION_BY_INDEX(this.props.index)}>
        <View style={this.styles.meaning_container}>
          <WordClassList
            theme={this.props.theme}
            screenLayout={this.props.screenLayout}
            wordClasses={
              this.props.definition.extraFields.wordClass.length > 0
                ? this.props.definition.extraFields.wordClass.map(
                    (values): string => values[0],
                  )
                : this.props.definition.wordClasses
            }
            isUsingCustomWordClasses={
              this.props.definition.extraFields.wordClass.length > 0
            }
            noBorder={this.props.theme === Theme.DARK}
          />
          <View style={this.styles.plain_meaning_container}>
            <DefaultText style={this.styles.plain_meaning}>
              {this.props.definition.plainMeaning}
            </DefaultText>
          </View>
        </View>
        <DefinitionExtraFieldList
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          extraFields={this.props.definition.extraFields}
          hideFields={this.props.hideFields}
        />
      </View>
    );
  }
}
