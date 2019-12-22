/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreen } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { LearnScreenIds } from '../../constants/ids/LearnScreenIds';
import { LearnScreenFactory } from '../../factories/learn/LearnScreenFactory';
import { LearnScreen } from './LearnScreen';
import { LearnScreenStyle } from './LearnScreenContainer.style';

@observer
export class LearnScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? LearnScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : LearnScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new LearnScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  protected observableScreen = new ObservableScreen(ScreenName.LEARN_SCREEN, {
    title: 'Learn',
    subtitle: this.props.rootStore.setStore.existingCurrentSet.setName,
    testID: LearnScreenIds.SHOW_SET_SELECTION_MENU_BTN,
    icon: _.has(
      Images.FLAG_ICONS_BY_LANGUAGE_CODE,
      this.props.rootStore.setStore.existingCurrentSet.learningLanguageCode
    )
      ? _.get(
          Images.FLAG_ICONS_BY_LANGUAGE_CODE,
          this.props.rootStore.setStore.existingCurrentSet.learningLanguageCode
        )
      : Images.FLAG_ICONS_BY_LANGUAGE_CODE.any,
    onTitlePress: (): void => {
      this.setSelectionMenuDelegate.showActiveSetsForSetSelection();
    },
  });

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private setSelectionMenuDelegate = this.screenFactory.createSetSelectionMenuDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate();

  public componentDidMount(): void {
    this.setSelectionMenuDelegate.autoUpdateSubtitleOnSetChange(
      this.observableScreen
    );
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? LearnScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : LearnScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <LearnScreen
        setStore={this.props.rootStore.setStore}
        darkModeStore={this.props.rootStore.darkModeStore}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
