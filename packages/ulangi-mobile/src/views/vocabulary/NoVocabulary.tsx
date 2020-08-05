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
import { RefreshControl, ScrollView } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  NoVocabularyStyles,
  noVocabularyResponsiveStyles,
} from './NoVocabulary.style';

export interface NoVocabularyProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  refresh: () => void;
}

@observer
export class NoVocabulary extends React.Component<NoVocabularyProps> {
  private get styles(): NoVocabularyStyles {
    return noVocabularyResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ScrollView
        contentContainerStyle={this.styles.scroll_view_container}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={this.props.refresh} />
        }>
        {this.renderText()}
      </ScrollView>
    );
  }

  private renderText(): React.ReactElement<any> {
    return (
      <DefaultText style={this.styles.no_vocabulary_text}>
        No vocabulary yet.
      </DefaultText>
    );
  }
}
