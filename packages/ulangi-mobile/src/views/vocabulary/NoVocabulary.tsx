/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';

export interface NoVocabularyProps {
  selectedFilterType: IObservableValue<VocabularyFilterType>;
  refresh: () => void;
  showQuickTutorial?: () => void;
}

@observer
export class NoVocabulary extends React.Component<NoVocabularyProps> {
  public render(): React.ReactElement<any> {
    return (
      <ScrollView
        contentContainerStyle={styles.scroll_view_container}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={this.props.refresh} />
        }
      >
        <Animatable.View
          style={styles.animation_container}
          animation="fadeIn"
          useNativeDriver
        >
          {this.renderText()}
          {typeof this.props.showQuickTutorial !== 'undefined' ? (
            <TouchableOpacity
              style={styles.button_container}
              onPress={this.props.showQuickTutorial}
            >
              <DefaultText style={styles.quick_tutorial}>
                View quick tutorial
              </DefaultText>
            </TouchableOpacity>
          ) : null}
        </Animatable.View>
      </ScrollView>
    );
  }

  private renderText(): null | React.ReactElement<any> {
    if (this.props.selectedFilterType.get() === VocabularyFilterType.ACTIVE) {
      return (
        <DefaultText style={styles.add_text}>
          Kickstart your learning journey.
        </DefaultText>
      );
    } else {
      return (
        <DefaultText style={styles.no_vocabulary_text}>
          No vocabulary yet.
        </DefaultText>
      );
    }
  }
}

const styles = StyleSheet.create({
  scroll_view_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  animation_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  no_vocabulary_text: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    lineHeight: 19,
  },

  add_text: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    paddingTop: 3,
  },

  button_container: {
    marginTop: 12,
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 20,
    backgroundColor: config.styles.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
    elevation: 3,
  },

  quick_tutorial: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
});
