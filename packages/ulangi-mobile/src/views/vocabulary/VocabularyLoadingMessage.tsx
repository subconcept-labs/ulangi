/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  VocabularyLoadingMessageStyles,
  vocabularyLoadingMessageResponsiveStyles,
} from './VocabularyLoadingMessage.style';

export interface VocabularyLoadingMessageProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  message: string;
}

@observer
export class VocabularyLoadingMessage extends React.Component<
  VocabularyLoadingMessageProps
> {
  private get styles(): VocabularyLoadingMessageStyles {
    return vocabularyLoadingMessageResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ScrollView contentContainerStyle={this.styles.loading_container}>
        <DefaultText style={this.styles.loading_text}>
          {this.props.message}
        </DefaultText>
      </ScrollView>
    );
  }
}
