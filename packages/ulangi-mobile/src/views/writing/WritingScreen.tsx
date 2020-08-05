/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableThemeStore,
  ObservableWritingScreen,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { WritingScreenIds } from '../../constants/ids/WritingScreenIds';
import { WritingScreenDelegate } from '../../delegates/writing/WritingScreenDelegate';
import { SelectedCategories } from '../category/SelectedCategories';
import { Screen } from '../common/Screen';
import { WritingMenu } from './WritingMenu';
import {
  WritingScreenStyles,
  writingScreenResponsiveStyles,
} from './WritingScreen.style';
import { WritingTitle } from './WritingTitle';

export interface WritingScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableWritingScreen;
  screenDelegate: WritingScreenDelegate;
}

@observer
export class WritingScreen extends React.Component<WritingScreenProps> {
  private get styles(): WritingScreenStyles {
    return writingScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        useSafeAreaView={false}
        testID={WritingScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}>
        <View style={this.styles.container}>
          <View style={this.styles.middle_container}>
            <View style={this.styles.title_container}>
              <WritingTitle
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
              />
            </View>
            <View style={this.styles.menu_container}>
              <WritingMenu
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                startLesson={(): void =>
                  this.props.screenDelegate.startLesson(false)
                }
                showSettings={this.props.screenDelegate.showSettings}
                showFAQ={this.props.screenDelegate.showFAQ}
              />
            </View>
            <View style={this.styles.selected_categories_container}>
              <SelectedCategories
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                selectedCategoryNames={
                  this.props.observableScreen.selectedCategoryNames
                }
                showSelectSpecificCategoryMessage={
                  this.props.screenDelegate.showSelectSpecificCategoryMessage
                }
              />
            </View>
          </View>
        </View>
      </Screen>
    );
  }
}
