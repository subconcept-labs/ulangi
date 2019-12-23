/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableFlashcardPlayerScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { FlashcardPlayerScreenIds } from '../../constants/ids/FlashcardPlayerScreenIds';
import { FlashcardPlayerScreenDelegate } from '../../delegates/flashcard-player/FlashcardPlayerScreenDelegate';
import { SelectedCategories } from '../../views/category/SelectedCategories';
import { DefaultText } from '../common/DefaultText';
import { FlashcardPlayerMenu } from './FlashcardPlayerMenu';
import { FlashcardPlayerSlogan } from './FlashcardPlayerSlogan';
import { FlashcardPlayerTitle } from './FlashcardPlayerTitle';
import { FlashcardPlayerTopBar } from './FlashcardPlayerTopBar';

export interface FlashcardPlayerScreenProps {
  observableScreen: ObservableFlashcardPlayerScreen;
  screenDelegate: FlashcardPlayerScreenDelegate;
}

@observer
export class FlashcardPlayerScreen extends React.Component<
  FlashcardPlayerScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={FlashcardPlayerScreenIds.SCREEN}>
        <View style={styles.top_bar_container}>
          <FlashcardPlayerTopBar back={this.props.screenDelegate.back} />
        </View>
        <View style={styles.middle_container}>
          <View style={styles.title_container}>
            <FlashcardPlayerTitle />
          </View>
          <View style={styles.slogan_container}>
            <FlashcardPlayerSlogan />
          </View>
          <View style={styles.menu_container}>
            <FlashcardPlayerMenu
              uploadToFlashcardPlayer={
                this.props.screenDelegate.uploadToFlashcardPlayer
              }
            />
          </View>
          <View style={styles.selected_categories_container}>
            <SelectedCategories
              selectedCategoryNames={
                this.props.observableScreen.selectedCategoryNames
              }
              showSelectSpecificCategoryMessage={
                this.props.screenDelegate.showSelectSpecificCategoryMessage
              }
              theme={Theme.DARK}
            />
          </View>
        </View>
        <View style={styles.bottom_container}>
          <DefaultText style={styles.note}>
            Note: This tool is not a part of Ulangi. The flashcards will be
            autoplayed in{' '}
            <DefaultText
              style={styles.flashcard_player_link}
              onPress={this.props.screenDelegate.openFlashcardPlayerHomePage}>
              flashcardplayer.com
            </DefaultText>
            .
          </DefaultText>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  top_bar_container: {},

  middle_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  slogan_container: {},

  title_container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -100,
  },

  menu_container: {
    marginTop: 20,
    alignSelf: 'stretch',
  },

  selected_categories_container: {
    marginTop: 20,
  },

  bottom_container: {
    padding: 16,
  },

  note: {
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
    color: '#1495bc',
  },

  flashcard_player_link: {
    textDecorationLine: 'underline',
  },
});
