/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observer } from 'mobx-react';
import * as React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';

export interface QuickTutorialButtonProps {
  refresh: () => void;
  goToGoogleSheetsAddOnScreen: () => void;
  showQuickTutorial: () => void;
}

@observer
export class QuickTutorialButton extends React.Component<
  QuickTutorialButtonProps
> {
  public render(): React.ReactElement<any> {
    return (
      <ScrollView
        contentContainerStyle={styles.scroll_view_container}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={this.props.refresh} />
        }>
        {this.renderText()}
        <TouchableOpacity
          style={styles.button_container}
          onPress={this.props.showQuickTutorial}>
          <DefaultText style={styles.quick_tutorial}>
            View quick tutorial
          </DefaultText>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  private renderText(): null | React.ReactElement<any> {
    return (
      <DefaultText style={styles.add_text}>
        Start collecting words you want to memorize (or{' '}
        <DefaultText
          onPress={this.props.goToGoogleSheetsAddOnScreen}
          style={styles.highlighted}>
          sync with Google Sheets
        </DefaultText>
        .)
      </DefaultText>
    );
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

  add_text: {
    textAlign: 'center',
    fontSize: 15,
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

  highlighted: {
    color: config.styles.primaryColor,
  },
});
