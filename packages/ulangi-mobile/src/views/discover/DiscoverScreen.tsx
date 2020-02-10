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
import { StyleSheet, View } from 'react-native';

import { DiscoverScreenIds } from '../../constants/ids/DiscoverScreenIds';
import { DiscoverScreenDelegate } from '../../delegates/discover/DiscoverScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { DismissKeyboardView } from '../common/DismissKeyboardView';
import { DiscoverCenterTitle } from './DiscoverCenterTitle';
import { DiscoverNavBar } from './DiscoverNavBar';
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
  private isSupported(): boolean {
    const currentSet = this.props.setStore.existingCurrentSet;
    return (
      currentSet.learningLanguageCode !== 'any' &&
      currentSet.translatedToLanguageCode !== 'any'
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <DismissKeyboardView
        style={styles.screen}
        testID={DiscoverScreenIds.SCREEN}>
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
      </DismissKeyboardView>
    );
  }

  private renderTopBar(): React.ReactElement<any> {
    return (
      <View style={styles.top_container}>
        <DiscoverSearch
          theme={this.props.themeStore.theme}
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
        setStore={this.props.setStore}
        publicSetCount={this.props.observableScreen.publicSetCount}
        search={this.props.screenDelegate.setInputAndRefresh}
      />
    );
  }

  private renderFloatingButton(): null | React.ReactElement<any> {
    return (
      <View style={styles.floating_button_container}>
        <SearchFloatingButton
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
          showPublicVocabularyActionMenu={
            this.props.screenDelegate.showPublicVocabularyActionMenu
          }
          showTranslationActionMenu={
            this.props.screenDelegate.showTranslationActionMenu
          }
          onEndReached={this.props.screenDelegate.searchPublicVocabulary}
          refresh={this.props.screenDelegate.refreshCurrentList}
          openLink={this.props.screenDelegate.openLink}
        />
      );
    } else {
      return (
        <PublicSetList
          theme={this.props.themeStore.theme}
          isPremadeSetList={
            this.props.observableScreen.listType.get() ===
            DiscoverListType.PREMADE_SET_LIST
          }
          publicSetListState={this.props.observableScreen.publicSetListState}
          showSetDetailModal={this.props.screenDelegate.showSetDetailModal}
          refresh={this.props.screenDelegate.refreshCurrentList}
          onEndReached={this.props.screenDelegate.searchPublicSets}
        />
      );
    }
  }

  private renderNotSupported(): React.ReactElement<any> {
    return (
      <View
        testID={DiscoverScreenIds.UNSUPPORTED_SECTION}
        style={styles.message_container}>
        <DefaultText style={styles.message}>
          {
            'This section is not supported because you select "Any Language". You can go to Set Management and change it to a specific language.'
          }
        </DefaultText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  top_container: {},

  message_container: {
    flex: 1,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  message: {
    color: '#888',
    fontSize: 15,
  },

  floating_button_container: {
    position: 'absolute',
    right: 14,
    bottom: 14,
  },
});
