/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservablePublicSetDetailScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { PublicSetDetailScreenIds } from '../../constants/ids/PublicSetDetailScreenIds';
import { PublicSetDetailScreenDelegate } from '../../delegates/discover/PublicSetDetailScreenDelegate';
import { Screen } from '../common/Screen';
import { PublicSetDetailHeader } from './PublicSetDetailHeader';
import {
  PublicSetDetailScreenStyles,
  publicSetDetailScreenResponsiveStyles,
} from './PublicSetDetailScreen.style';
import { PublicVocabularyList } from './PublicVocabularyList';

export interface PublicSetDetailScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservablePublicSetDetailScreen;
  screenDelegate: PublicSetDetailScreenDelegate;
}

@observer
export class PublicSetDetailScreen extends React.Component<
  PublicSetDetailScreenProps
> {
  public get styles(): PublicSetDetailScreenStyles {
    return publicSetDetailScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={PublicSetDetailScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <PublicSetDetailHeader
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          title={this.props.observableScreen.publicSet.title}
          subtitle={this.props.observableScreen.publicSet.subtitle}
          attributions={this.props.observableScreen.publicSet.attributions}
          addAllVocabulary={this.props.screenDelegate.showAddAllDialog}
          numberOfTerms={
            this.props.observableScreen.publicSet.vocabularyList.length
          }
          showLink={this.props.screenDelegate.showLink}
        />
        <PublicVocabularyList
          testID={PublicSetDetailScreenIds.PUBLIC_VOCABULARY_LIST}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          vocabularyList={this.props.observableScreen.publicSet.vocabularyList}
          addVocabulary={this.props.screenDelegate.addVocabulary}
          showPublicVocabularyDetail={
            this.props.screenDelegate.showPublicVocabularyDetail
          }
          showPublicVocabularyActionMenu={
            this.props.screenDelegate.showPublicVocabularyActionMenu
          }
          showLink={this.props.screenDelegate.showLink}
        />
      </Screen>
    );
  }
}
