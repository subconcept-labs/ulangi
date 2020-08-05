/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableTranslation,
} from '@ulangi/ulangi-observable';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { Translation } from './Translation';
import {
  TranslationListStyles,
  translationListResponsiveStyles,
} from './TranslationList.style';

export interface TranslationListProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  translations: readonly ObservableTranslation[];
  onPick: (definition: ObservableTranslation) => void;
  styles?: {
    light: TranslationListStyles;
    dark: TranslationListStyles;
  };
}

export class TranslationList extends React.Component<TranslationListProps> {
  public get styles(): TranslationListStyles {
    return translationListResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <React.Fragment>
        <View key="source" style={this.styles.source_container}>
          <DefaultText style={this.styles.source_text}>
            Translations
          </DefaultText>
        </View>
        {this.props.translations.map(
          (translation, index): React.ReactElement<any> => {
            return (
              <Translation
                key={index}
                theme={this.props.theme}
                screenLayout={this.props.screenLayout}
                index={index}
                translation={translation}
                onPick={this.props.onPick}
              />
            );
          },
        )}
      </React.Fragment>
    );
  }
}
