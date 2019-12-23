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
import { View } from 'react-native';

import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DefaultText } from '../common/DefaultText';
import { AddDefinitionButton } from './AddDefinitionButton';
import {
  DictionaryDefinitionStyles,
  darkStyles,
  lightStyles,
} from './DictionaryDefinition.style';
import { WordClassList } from './WordClassList';

export interface DictionaryDefinitionProps {
  index: number;
  theme: Theme;
  definition: ObservableDictionaryDefinition;
  onPick: (definition: DeepPartial<Definition>) => void;
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
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.definition_container}>
        <View style={this.styles.definition_content_container}>
          <WordClassList
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
            testID={VocabularyFormIds.ADD_DEFINITION_FROM_DICTIONARY_BY_INDEX(
              this.props.index,
            )}
            onPress={(): void =>
              this.props.onPick({
                meaning: this.props.definition.meaning,
                wordClasses: this.props.definition.wordClasses,
                source: this.props.definition.source,
              })
            }
          />
        </View>
      </View>
    );
  }
}
