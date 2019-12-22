/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ActivityState,
  ButtonSize,
  DiscoverSectionType,
  Theme,
} from '@ulangi/ulangi-common/enums';
import {
  PublicVocabulary,
  TranslationWithLanguages,
} from '@ulangi/ulangi-common/interfaces';
import {
  ObservablePublicVocabulary,
  ObservablePublicVocabularyListState,
  ObservableTranslationListState,
  ObservableTranslationWithLanguages,
} from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import * as React from 'react';
import { SectionList, StyleSheet, View } from 'react-native';

import { DiscoverScreenIds } from '../../constants/ids/DiscoverScreenIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultActivityIndicator } from '../common/DefaultActivityIndicator';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { PublicVocabularyItem } from './PublicVocabularyItem';
import { TranslationItem } from './TranslationItem';

export interface TranslationAndPublicVocabularyListProps {
  theme: Theme;
  learningLanguageCode: string;
  translatedToLanguageCode: string;
  publicVocabularyListState: ObservablePublicVocabularyListState;
  translationListState: ObservableTranslationListState;
  addVocabularyFromPublicVocabulary: (vocabulary: PublicVocabulary) => void;
  addVocabularyFromTranslation: (translation: TranslationWithLanguages) => void;
  showPublicVocabularyActionMenu: (vocabulary: PublicVocabulary) => void;
  showTranslationActionMenu: (translation: TranslationWithLanguages) => void;
  onEndReached: () => void;
  refresh: () => void;
  openLink: (link: string) => void;
}

@observer
export class TranslationAndPublicVocabularyList extends React.Component<
  TranslationAndPublicVocabularyListProps
> {
  private keyExtractorForTranslation = (
    item: ObservableTranslationWithLanguages
  ): string =>
    [item.sourceText, item.translatedText, item.translatedBy].join('-');

  private keyExtractorForPublicVocabulary = (
    item: [string, ObservablePublicVocabulary]
  ): string => item[0];

  public render(): React.ReactElement<any> {
    if (
      this.props.translationListState.translateState.get() ===
        ActivityState.ERROR ||
      this.props.publicVocabularyListState.searchState.get() ===
        ActivityState.ERROR
    ) {
      return (
        <View testID={DiscoverScreenIds.ERROR} style={styles.center_container}>
          <DefaultText style={styles.message}>
            An error occurred. Please check internet connection.
          </DefaultText>
          <View style={styles.button_container}>
            <DefaultButton
              styles={FullRoundedButtonStyle.getGreyOutlineStyles(
                ButtonSize.SMALL
              )}
              text="Retry"
              onPress={this.props.refresh}
            />
          </View>
        </View>
      );
    } else if (
      this.props.translationListState.translations !== null &&
      this.props.publicVocabularyListState.publicVocabularyList !== null &&
      this.props.translationListState.translations.length === 0 &&
      this.props.publicVocabularyListState.publicVocabularyList.size === 0
    ) {
      return (
        <View
          testID={DiscoverScreenIds.NO_RESULTS}
          style={styles.center_container}
        >
          <DefaultText style={styles.message}>No vocabulary found.</DefaultText>
        </View>
      );
    } else {
      return (
        <SectionList
          testID={DiscoverScreenIds.TRANSLATION_AND_PUBLIC_VOCABULARY_LIST}
          contentContainerStyle={styles.list_container}
          sections={[
            {
              type: DiscoverSectionType.TRANSLATIONS,
              data: this.props.translationListState.translations
                ? this.props.translationListState.translations.slice()
                : [],
              renderItem: this.renderTranslationItem,
              keyExtractor: this.keyExtractorForTranslation,
            },
            {
              type: DiscoverSectionType.PUBLIC_VOCABULARY_LIST,
              data: this.props.publicVocabularyListState.publicVocabularyList
                ? Array.from(
                    this.props.publicVocabularyListState.publicVocabularyList
                  )
                : [],
              renderItem: this.renderPublicVocabularyItem,
              keyExtractor: this.keyExtractorForPublicVocabulary,
            },
          ]}
          onEndReachedThreshold={0.5}
          onEndReached={this.props.onEndReached}
          onRefresh={this.props.refresh}
          refreshing={
            this.props.translationListState.isRefreshing.get() ||
            this.props.publicVocabularyListState.isRefreshing.get()
          }
          renderSectionFooter={this.renderSectionFooter}
        />
      );
    }
  }

  @boundMethod
  private renderTranslationItem({
    item,
  }: {
    item: ObservableTranslationWithLanguages;
  }): React.ReactElement<any> {
    return (
      <TranslationItem
        theme={this.props.theme}
        learningLanguageCode={this.props.learningLanguageCode}
        translatedToLanguageCode={this.props.translatedToLanguageCode}
        translation={item}
        addVocabulary={this.props.addVocabularyFromTranslation}
        showTranslationActionMenu={this.props.showTranslationActionMenu}
      />
    );
  }

  @boundMethod
  private renderPublicVocabularyItem({
    item,
  }: {
    item: [string, ObservablePublicVocabulary];
  }): React.ReactElement<any> {
    const [, vocabulary] = item;
    return (
      <PublicVocabularyItem
        theme={this.props.theme}
        vocabulary={vocabulary}
        addVocabulary={this.props.addVocabularyFromPublicVocabulary}
        showPublicVocabularyActionMenu={
          this.props.showPublicVocabularyActionMenu
        }
        openLink={this.props.openLink}
      />
    );
  }

  @boundMethod
  private renderSectionFooter({
    section,
  }: {
    section: any;
  }): React.ReactElement<any> {
    if (section.sectionType === DiscoverSectionType.TRANSLATIONS) {
      return (
        <DefaultActivityIndicator
          activityState={this.props.translationListState.translateState}
          isRefreshing={this.props.translationListState.isRefreshing}
          style={styles.indicator}
          size="small"
        />
      );
    } else {
      return (
        <DefaultActivityIndicator
          activityState={this.props.publicVocabularyListState.searchState}
          isRefreshing={this.props.publicVocabularyListState.isRefreshing}
          style={styles.indicator}
          size="small"
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  list_container: {
    paddingBottom: 74,
    paddingTop: 8,
  },

  center_container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  message: {
    fontSize: 15,
    textAlign: 'center',
    color: '#888',
  },

  button_container: {
    marginTop: 8,
  },

  indicator: {
    marginTop: 16,
  },
});
