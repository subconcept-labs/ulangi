/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { config } from '../../constants/config';
import { PlayScreenIds } from '../../constants/ids/PlayScreenIds';
import { AtomTitle } from '../atom/AtomTitle';
import { ReflexTitle } from '../reflex/ReflexTitle';

export interface PlayListProps {
  navigateToAtomScreen: () => void;
  navigateToReflexScreen: () => void;
  navigateToFlashcardPlayerScreen: () => void;
}

export class PlayList extends React.Component<PlayListProps> {
  public render(): React.ReactElement<any> {
    return (
      <ScrollView contentContainerStyle={styles.scroll_view_container}>
        <TouchableOpacity
          testID={PlayScreenIds.REFLEX_BTN}
          style={[styles.game_item, styles.reflex_title_container]}
          onPress={this.props.navigateToReflexScreen}
        >
          <ReflexTitle />
        </TouchableOpacity>
        <TouchableOpacity
          testID={PlayScreenIds.ATOM_BTN}
          style={[styles.game_item, styles.atom_title_container]}
          onPress={this.props.navigateToAtomScreen}
        >
          <AtomTitle />
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scroll_view_container: {
    paddingBottom: 16,
  },

  game_item: {
    borderRadius: 10,
    marginTop: 16,
    marginHorizontal: 16,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },

  reflex_title_container: {
    backgroundColor: '#00B8A9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.5,
    shadowOpacity: 0.25,
    elevation: 0.5,
  },

  atom_title_container: {
    backgroundColor: config.atom.backgroundColor,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.5,
    shadowOpacity: 0.25,
    elevation: 0.5,
  },

  flashcard_player_title_container: {
    backgroundColor: config.flashcardPlayer.backgroundColor,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.5,
    shadowOpacity: 0.25,
    elevation: 0.5,
  },
});
