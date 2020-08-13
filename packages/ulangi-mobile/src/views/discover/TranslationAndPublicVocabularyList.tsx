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
  ObservableScreenLayout,
  ObservableTranslationListState,
  ObservableTranslationWithLanguages,
} from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import * as React from 'react';
import { SectionBase, SectionList, SectionListData, View } from 'react-native';

import { DiscoverScreenIds } from '../../constants/ids/DiscoverScreenIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultActivityIndicator } from '../common/DefaultActivityIndicator';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultText } from '../common/DefaultText';
import { PublicVocabularyItem } from './PublicVocabularyItem';
import {
  TranslationAndPublicVocabularyListStyles,
  translationAndPublicVocabularyListResponsiveStyles,
} from './TranslationAndPublicVocabularyList.style';
import { TranslationItem } from './TranslationItem';

export interface TranslationAndPublicVocabularyListProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  learningLanguageCode: string;
  translatedToLanguageCode: string;
  publicVocabularyListState: ObservablePublicVocabularyListState;
  translationListState: ObservableTranslationListState;
  addVocabularyFromPublicVocabulary: (vocabulary: PublicVocabulary) => void;
  addVocabularyFromTranslation: (translation: TranslationWithLanguages) => void;
  showPublicVocabularyActionMenu: (vocabulary: PublicVocabulary) => void;
  showTranslationActionMenu: (translation: TranslationWithLanguages) => void;
  showPublicVocabularyDetail: (vocabulary: PublicVocabulary) => void;
  onEndReached: () => void;
  refresh: () => void;
  showLink: (link: string, screenTitle: string) => void;
}

@observer
export class TranslationAndPublicVocabularyList extends React.Component<
  TranslationAndPublicVocabularyListProps
> {
  private keyExtractorForTranslation = (
    item: ObservableTranslationWithLanguages,
  ): string =>
    [item.sourceText, item.translatedText, item.translatedBy].join('-');

  private keyExtractorForPublicVocabulary = (
    item: [string, ObservablePublicVocabulary],
  ): string => item[0];

  private get styles(): TranslationAndPublicVocabularyListStyles {
    return translationAndPublicVocabularyListResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    if (
      this.props.translationListState.translateState.get() ===
        ActivityState.ERROR ||
      this.props.publicVocabularyListState.searchState.get() ===
        ActivityState.ERROR
    ) {
      return (
        <View
          testID={DiscoverScreenIds.ERROR}
          style={this.styles.center_container}>
          <DefaultText style={this.styles.message}>
            An error occurred. Please check internet connection.
          </DefaultText>
          <View style={this.styles.button_container}>
            <DefaultButton
              styles={fullRoundedButtonStyles.getGreyOutlineStyles(
                ButtonSize.SMALL,
                this.props.theme,
                this.props.screenLayout,
              )}
              text="Retry"
              onPress={this.props.refresh}
            />
          </View>
        </View>
      );
    } else if (
      this.props.translationListState.translationsWithLanguages !== null &&
      this.props.publicVocabularyListState.publicVocabularyList !== null &&
      this.props.translationListState.translationsWithLanguages.length === 0 &&
      this.props.publicVocabularyListState.publicVocabularyList.size === 0
    ) {
      return (
        <View
          testID={DiscoverScreenIds.NO_RESULTS}
          style={this.styles.center_container}>
          <DefaultText style={this.styles.message}>
            No vocabulary found.
          </DefaultText>
        </View>
      );
    } else {
      return (
        <SectionList
          testID={DiscoverScreenIds.TRANSLATION_AND_PUBLIC_VOCABULARY_LIST}
          contentContainerStyle={this.styles.list_container}
          sections={
            [
              {
                key: DiscoverSectionType.TRANSLATIONS,
                data: this.props.translationListState.translationsWithLanguages
                  ? this.props.translationListState.translationsWithLanguages.slice()
                  : [],
                renderItem: this.renderTranslationItem,
                keyExtractor: this.keyExtractorForTranslation,
              },
              {
                key: DiscoverSectionType.PUBLIC_VOCABULARY_LIST,
                data: this.props.publicVocabularyListState.publicVocabularyList
                  ? Array.from(
                      this.props.publicVocabularyListState.publicVocabularyList,
                    )
                  : [],
                renderItem: this.renderPublicVocabularyItem,
                keyExtractor: this.keyExtractorForPublicVocabulary,
              },
            ] as readonly SectionListData<
              ObservableTranslationWithLanguages | ObservablePublicVocabulary
            >[]
          }
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
        screenLayout={this.props.screenLayout}
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
        screenLayout={this.props.screenLayout}
        vocabulary={vocabulary}
        addVocabulary={this.props.addVocabularyFromPublicVocabulary}
        showPublicVocabularyDetail={this.props.showPublicVocabularyDetail}
        showPublicVocabularyActionMenu={
          this.props.showPublicVocabularyActionMenu
        }
        showLink={this.props.showLink}
      />
    );
  }

  @boundMethod
  private renderSectionFooter({
    section,
  }: {
    section: SectionBase<any>;
  }): React.ReactElement<any> {
    return (
      <DefaultActivityIndicator
        key={section.key}
        activityState={
          section.key === DiscoverSectionType.TRANSLATIONS
            ? this.props.translationListState.translateState
            : this.props.publicVocabularyListState.searchState
        }
        isRefreshing={
          section.key === DiscoverSectionType.TRANSLATIONS
            ? this.props.translationListState.isRefreshing
            : this.props.publicVocabularyListState.isRefreshing
        }
        style={this.styles.indicator}
        size="small"
      />
    );
  }
}
