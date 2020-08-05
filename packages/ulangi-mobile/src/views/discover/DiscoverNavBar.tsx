/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DiscoverListType, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservablePublicSetListState,
  ObservablePublicVocabularyListState,
  ObservableScreenLayout,
  ObservableTranslationListState,
} from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DiscoverScreenIds } from '../../constants/ids/DiscoverScreenIds';
import { DiscoverNavButton } from '../../views/discover/DiscoverNavButton';
import {
  DiscoverNavBarStyles,
  discoverNavBarResponsiveStyles,
} from './DiscoverNavBar.style';

export interface DiscoverNavBarProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  listType: IObservableValue<null | DiscoverListType>;
  publicSetListState: ObservablePublicSetListState;
  publicVocabularyListState: ObservablePublicVocabularyListState;
  translationListState: ObservableTranslationListState;
  setListType: (listType: null | DiscoverListType) => void;
}

@observer
export class DiscoverNavBar extends React.Component<DiscoverNavBarProps> {
  private get styles(): DiscoverNavBarStyles {
    return discoverNavBarResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): null | React.ReactElement<any> {
    if (
      this.props.listType.get() === null ||
      this.props.listType.get() === DiscoverListType.PREMADE_SET_LIST
    ) {
      return null;
    } else {
      return (
        <View style={this.styles.container}>
          <DiscoverNavButton
            testID={
              DiscoverScreenIds.VIEW_TRANSLATION_AND_SEARCH_VOCABULARY_RESULT_BTN
            }
            theme={this.props.theme}
            screenLayout={this.props.screenLayout}
            isSelected={
              this.props.listType.get() ===
              DiscoverListType.TRANSLATION_AND_PUBLIC_VOCABULARY_LIST
            }
            onPress={(): void => {
              this.props.setListType(
                DiscoverListType.TRANSLATION_AND_PUBLIC_VOCABULARY_LIST,
              );
            }}
            text="Terms"
            count={this.numOfTranslationsAndVocabulary()}
          />
          <DiscoverNavButton
            testID={DiscoverScreenIds.VIEW_SEARCH_SET_RESULT_BTN}
            theme={this.props.theme}
            screenLayout={this.props.screenLayout}
            isSelected={
              this.props.listType.get() === DiscoverListType.PUBLIC_SET_LIST
            }
            onPress={(): void => {
              this.props.setListType(DiscoverListType.PUBLIC_SET_LIST);
            }}
            text="Categories"
            count={this.numOfSets()}
          />
        </View>
      );
    }
  }

  private numOfSets(): null | number {
    return this.props.publicSetListState.publicSetList === null
      ? null
      : this.props.publicSetListState.publicSetList.size;
  }

  private numOfTranslationsAndVocabulary(): null | number {
    const publicVocabularyList = this.props.publicVocabularyListState
      .publicVocabularyList;
    const translations = this.props.translationListState
      .translationsWithLanguages;
    if (publicVocabularyList === null && translations === null) {
      return null;
    } else {
      return (
        (publicVocabularyList !== null ? publicVocabularyList.size : 0) +
        (translations !== null ? translations.length : 0)
      );
    }
  }
}
