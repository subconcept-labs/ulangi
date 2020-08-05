/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { PublicVocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  ObservablePublicVocabulary,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FlatList } from 'react-native';

import { PublicVocabularyItem } from './PublicVocabularyItem';
import {
  PublicVocabularyListStyles,
  publicVocabularyListResponsiveStyles,
} from './PublicVocabularyList.style';

export interface PublicVocabularyListProps {
  testID: string;
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  vocabularyList: readonly ObservablePublicVocabulary[];
  addVocabulary: (vocabulary: PublicVocabulary) => void;
  showPublicVocabularyActionMenu: (vocabulary: PublicVocabulary) => void;
  showPublicVocabularyDetail: (vocabulary: PublicVocabulary) => void;
  openLink: (link: string) => void;
}

@observer
export class PublicVocabularyList extends React.Component<
  PublicVocabularyListProps
> {
  private keyExtractor = (item: ObservablePublicVocabulary): string =>
    item.publicVocabularyId;

  private get styles(): PublicVocabularyListStyles {
    return publicVocabularyListResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <FlatList
        testID={this.props.testID}
        keyExtractor={this.keyExtractor}
        contentContainerStyle={this.styles.list_container}
        data={this.props.vocabularyList}
        renderItem={({
          item,
        }: {
          item: ObservablePublicVocabulary;
        }): React.ReactElement<any> => {
          return (
            <PublicVocabularyItem
              theme={this.props.theme}
              screenLayout={this.props.screenLayout}
              vocabulary={item}
              addVocabulary={this.props.addVocabulary}
              showPublicVocabularyDetail={this.props.showPublicVocabularyDetail}
              showPublicVocabularyActionMenu={
                this.props.showPublicVocabularyActionMenu
              }
              openLink={this.props.openLink}
            />
          );
        }}
      />
    );
  }
}
