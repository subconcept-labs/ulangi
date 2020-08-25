/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableSpacedRepetitionScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { SpacedRepetitionScreenIds } from '../../constants/ids/SpacedRepetitionScreenIds';
import { SpacedRepetitionScreenDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionScreenDelegate';
import { SelectCategoryButton } from '../category/SelectCategoryButton';
import { Screen } from '../common/Screen';
import { DueAndNewCounts } from './DueAndNewCounts';
import { SpacedRepetitionMenu } from './SpacedRepetitionMenu';
import {
  SpacedRepetitionScreenStyles,
  spacedRepetitionScreenResponsiveStyles,
} from './SpacedRepetitionScreen.style';
import { SpacedRepetitionTitle } from './SpacedRepetitionTitle';

export interface SpacedRepetitionScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableSpacedRepetitionScreen;
  screenDelegate: SpacedRepetitionScreenDelegate;
}

@observer
export class SpacedRepetitionScreen extends React.Component<
  SpacedRepetitionScreenProps
> {
  private get styles(): SpacedRepetitionScreenStyles {
    return spacedRepetitionScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={SpacedRepetitionScreenIds.SCREEN}
        useSafeAreaView={false}
        observableScreen={this.props.observableScreen}>
        <View style={this.styles.container}>
          <View style={this.styles.middle_container}>
            <View style={this.styles.title_container}>
              <SpacedRepetitionTitle
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
              />
            </View>
            <View style={this.styles.menu_container}>
              <SpacedRepetitionMenu
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
              <SelectCategoryButton
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                selectedCategoryNames={
                  this.props.observableScreen.selectedCategoryNames
                }
                selectCategory={this.props.screenDelegate.selectCategory}
              />
            </View>
            <DueAndNewCounts
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              counts={this.props.observableScreen.counts}
              showLeft={false}
            />
          </View>
        </View>
      </Screen>
    );
  }
}
