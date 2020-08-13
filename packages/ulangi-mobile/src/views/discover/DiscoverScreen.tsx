/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DiscoverListType } from '@ulangi/ulangi-common/enums';
import {
  ObservableDiscoverScreen,
  ObservableSetStore,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DiscoverScreenIds } from '../../constants/ids/DiscoverScreenIds';
import { DiscoverScreenDelegate } from '../../delegates/discover/DiscoverScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { DiscoverCenterTitle } from './DiscoverCenterTitle';
import { DiscoverNavBar } from './DiscoverNavBar';
import {
  DiscoverScreenStyles,
  discoverScreenResponsiveStyles,
} from './DiscoverScreen.style';
import { DiscoverSearch } from './DiscoverSearch';
import { PublicSetList } from './PublicSetList';
import { SearchFloatingButton } from './SearchFloatingButton';
import { TranslationAndPublicVocabularyList } from './TranslationAndPublicVocabularyList';

export interface DiscoverScreenProps {
  setStore: ObservableSetStore;
  themeStore: ObservableThemeStore;
  observableScreen: ObservableDiscoverScreen;
  screenDelegate: DiscoverScreenDelegate;
}

@observer
export class DiscoverScreen extends React.Component<DiscoverScreenProps> {
  private get styles(): DiscoverScreenStyles {
    return discoverScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  private isSupported(): boolean {
    const currentSet = this.props.setStore.existingCurrentSet;
    return (
      currentSet.learningLanguageCode !== 'any' &&
      currentSet.translatedToLanguageCode !== 'any'
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={DiscoverScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useDismissKeyboardView={true}
        useSafeAreaView={true}>
        {this.isSupported() ? (
          <React.Fragment>
            {this.renderTopBar()}
            {this.props.observableScreen.listType.get() === null
              ? this.renderCenterTitle()
              : this.renderList()}
            {this.renderFloatingButton()}
          </React.Fragment>
        ) : (
          this.renderNotSupported()
        )}
      </Screen>
    );
  }

  private renderTopBar(): React.ReactElement<any> {
    return (
      <View style={this.styles.top_container}>
        <DiscoverSearch
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          setStore={this.props.setStore}
          searchInput={this.props.observableScreen.searchInput}
          searchInputAutoFocus={
            this.props.observableScreen.searchInputAutoFocus
          }
          shouldFocusSearchInput={
            this.props.observableScreen.shouldFocusSearchInput
          }
          clearSearchInput={this.props.screenDelegate.clearSearchInput}
          onSubmitEditing={this.props.screenDelegate.handleInputEnded}
        />
        <DiscoverNavBar
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          listType={this.props.observableScreen.listType}
          publicSetListState={this.props.observableScreen.publicSetListState}
          publicVocabularyListState={
            this.props.observableScreen.publicVocabularyListState
          }
          translationListState={
            this.props.observableScreen.translationListState
          }
          setListType={this.props.screenDelegate.setListTypeAndRefresh}
        />
      </View>
    );
  }

  private renderCenterTitle(): React.ReactElement<any> {
    return (
      <DiscoverCenterTitle
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        setStore={this.props.setStore}
        publicSetCount={this.props.observableScreen.publicSetCount}
        search={this.props.screenDelegate.setInputAndRefresh}
      />
    );
  }

  private renderFloatingButton(): null | React.ReactElement<any> {
    return (
      <View style={this.styles.floating_button_container}>
        <SearchFloatingButton
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          focusSearchInput={this.props.screenDelegate.focusSearchInput}
        />
      </View>
    );
  }

  private renderList(): React.ReactElement<any> {
    if (
      this.props.observableScreen.listType.get() ===
      DiscoverListType.TRANSLATION_AND_PUBLIC_VOCABULARY_LIST
    ) {
      return (
        <TranslationAndPublicVocabularyList
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          learningLanguageCode={
            this.props.setStore.existingCurrentSet.learningLanguageCode
          }
          translatedToLanguageCode={
            this.props.setStore.existingCurrentSet.translatedToLanguageCode
          }
          publicVocabularyListState={
            this.props.observableScreen.publicVocabularyListState
          }
          translationListState={
            this.props.observableScreen.translationListState
          }
          addVocabularyFromPublicVocabulary={
            this.props.screenDelegate.addVocabularyFromPublicVocabulary
          }
          addVocabularyFromTranslation={
            this.props.screenDelegate.addVocabularyFromTranslation
          }
          showPublicVocabularyDetail={
            this.props.screenDelegate.showPublicVocabularyDetail
          }
          showPublicVocabularyActionMenu={
            this.props.screenDelegate.showPublicVocabularyActionMenu
          }
          showTranslationActionMenu={
            this.props.screenDelegate.showTranslationActionMenu
          }
          onEndReached={this.props.screenDelegate.searchPublicVocabulary}
          refresh={this.props.screenDelegate.refreshCurrentList}
          showLink={this.props.screenDelegate.showLink}
        />
      );
    } else {
      return (
        <PublicSetList
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          publicSetListState={this.props.observableScreen.publicSetListState}
          showSetDetailModal={this.props.screenDelegate.showSetDetailModal}
          refresh={this.props.screenDelegate.refreshCurrentList}
          onEndReached={this.props.screenDelegate.searchPublicSets}
          headerComponent={
            this.props.observableScreen.listType.get() ===
            DiscoverListType.PREMADE_SET_LIST ? (
              <DefaultText style={this.styles.header_text}>
                You can search dictionary for words or categories, such as
                <DefaultText
                  style={this.styles.highlighted}
                  onPress={(): void =>
                    this.props.screenDelegate.setInputAndRefresh('cat')
                  }>
                  {' '}
                  cat
                </DefaultText>{' '}
                or
                <DefaultText
                  style={this.styles.highlighted}
                  onPress={(): void =>
                    this.props.screenDelegate.setInputAndRefresh('animals')
                  }>
                  {' '}
                  animals
                </DefaultText>
                .
              </DefaultText>
            ) : null
          }
        />
      );
    }
  }

  private renderNotSupported(): React.ReactElement<any> {
    return (
      <View
        testID={DiscoverScreenIds.UNSUPPORTED_SECTION}
        style={this.styles.message_container}>
        <DefaultText style={this.styles.message}>
          {
            'This section is not supported because you select "Any Language". You can go to Set Management and change it to a specific language.'
          }
        </DefaultText>
      </View>
    );
  }
}
