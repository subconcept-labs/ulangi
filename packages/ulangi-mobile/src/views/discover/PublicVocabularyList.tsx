/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { PublicVocabulary } from '@ulangi/ulangi-common/interfaces';
import { ObservablePublicVocabulary } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { PublicVocabularyItem } from './PublicVocabularyItem';
import { PublicVocabularyListHeader } from './PublicVocabularyListHeader';

export interface PublicVocabularyListProps {
  testID: string;
  theme: Theme;
  vocabularyList: readonly ObservablePublicVocabulary[];
  addVocabulary: (vocabulary: PublicVocabulary) => void;
  addAllVocabulary: () => void;
  showPublicVocabularyActionMenu: (vocabulary: PublicVocabulary) => void;
  openLink: (link: string) => void;
}

@observer
export class PublicVocabularyList extends React.Component<
  PublicVocabularyListProps
> {
  private keyExtractor = (item: ObservablePublicVocabulary): string =>
    item.publicVocabularyId;

  public render(): React.ReactElement<any> {
    return (
      <FlatList
        testID={this.props.testID}
        keyExtractor={this.keyExtractor}
        contentContainerStyle={styles.list_container}
        data={this.props.vocabularyList}
        renderItem={({
          item,
        }: {
          item: ObservablePublicVocabulary;
        }): React.ReactElement<any> => {
          return (
            <PublicVocabularyItem
              theme={this.props.theme}
              vocabulary={item}
              addVocabulary={this.props.addVocabulary}
              showPublicVocabularyActionMenu={
                this.props.showPublicVocabularyActionMenu
              }
              openLink={this.props.openLink}
            />
          );
        }}
        ListHeaderComponent={(): React.ReactElement<any> => {
          return (
            <PublicVocabularyListHeader
              theme={this.props.theme}
              numberOfTerms={this.props.vocabularyList.length}
              addAllVocabulary={this.props.addAllVocabulary}
            />
          );
        }}
        stickyHeaderIndices={[0]}
      />
    );
  }
}

const styles = StyleSheet.create({
  list_container: {
    paddingBottom: 74,
  },
});
