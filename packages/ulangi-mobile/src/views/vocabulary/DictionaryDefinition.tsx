/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDictionaryDefinition,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DefaultText } from '../common/DefaultText';
import { AddDefinitionButton } from './AddDefinitionButton';
import {
  DictionaryDefinitionStyles,
  dictionaryDefinitionResponsiveStyles,
} from './DictionaryDefinition.style';
import { WordClassList } from './WordClassList';

export interface DictionaryDefinitionProps {
  index: number;
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  definition: ObservableDictionaryDefinition;
  onPick: (definition: ObservableDictionaryDefinition) => void;
  styles?: {
    light: DictionaryDefinitionStyles;
    dark: DictionaryDefinitionStyles;
  };
}

@observer
export class DictionaryDefinition extends React.Component<
  DictionaryDefinitionProps
> {
  public get styles(): DictionaryDefinitionStyles {
    return dictionaryDefinitionResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.definition_container}>
        <View style={this.styles.definition_content_container}>
          <WordClassList
            theme={this.props.theme}
            screenLayout={this.props.screenLayout}
            wordClasses={this.props.definition.wordClasses}
            isUsingCustomWordClasses={false}
            noBorder={this.props.theme === Theme.DARK}
          />
          <View style={this.styles.meaning_container}>
            <DefaultText style={this.styles.meaning_text}>
              {this.props.definition.meaning}
            </DefaultText>
          </View>
        </View>
        <View style={this.styles.add_button_container}>
          <AddDefinitionButton
            theme={this.props.theme}
            screenLayout={this.props.screenLayout}
            testID={VocabularyFormIds.ADD_DEFINITION_FROM_DICTIONARY_BY_INDEX(
              this.props.index,
            )}
            disabled={this.props.definition.isAdded}
            isAdded={this.props.definition.isAdded}
            onPress={(): void => this.props.onPick(this.props.definition)}
          />
        </View>
      </View>
    );
  }
}
