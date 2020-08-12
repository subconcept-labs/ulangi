/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize } from '@ulangi/ulangi-common/enums';
import {
  ObservableAtomScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { AtomScreenIds } from '../../constants/ids/AtomScreenIds';
import { AtomScreenDelegate } from '../../delegates/atom/AtomScreenDelegate';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { SelectCategoryButton } from '../../views/category/SelectCategoryButton';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { AtomMenu } from './AtomMenu';
import {
  AtomScreenStyles,
  atomScreenResponsiveStyles,
} from './AtomScreen.style';
import { AtomTitle } from './AtomTitle';
import { AtomTopBar } from './AtomTopBar';

export interface AtomScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableAtomScreen;
  screenDelegate: AtomScreenDelegate;
}

@observer
export class AtomScreen extends React.Component<AtomScreenProps> {
  public get styles(): AtomScreenStyles {
    return atomScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={AtomScreenIds.SCREEN}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        <View style={this.styles.top_bar_container}>
          <AtomTopBar
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            iconTestID={AtomScreenIds.BACK_BTN}
            iconType="back"
            onPress={this.props.screenDelegate.back}
          />
        </View>
        <View style={this.styles.middle_container}>
          <View style={this.styles.title_container}>
            <AtomTitle />
          </View>
          <View style={this.styles.menu_container}>
            <AtomMenu
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              start={this.props.screenDelegate.startGame}
              goToTutorial={this.props.screenDelegate.goToTutorial}
            />
          </View>
          <View style={this.styles.selected_categories_container}>
            <SelectCategoryButton
              selectedCategoryNames={
                this.props.observableScreen.selectedCategoryNames
              }
              selectCategory={this.props.screenDelegate.selectCategory}
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              buttonStyles={fullRoundedButtonStyles.getOutlineStyles(
                ButtonSize.NORMAL,
                config.atom.primaryColor,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
            />
          </View>
        </View>
        <View style={this.styles.bottom_container}>
          <DefaultText style={this.styles.note} />
        </View>
      </Screen>
    );
  }
}
