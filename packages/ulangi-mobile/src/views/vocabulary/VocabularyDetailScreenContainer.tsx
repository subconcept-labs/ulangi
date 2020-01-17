/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ActivityState, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableTitleTopBar,
  ObservableTopBarButton,
  ObservableVocabularyDetailScreen,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { VocabularyDetailScreenIds } from '../../constants/ids/VocabularyDetailScreenIds';
import { VocabularyDetailScreenFactory } from '../../factories/vocabulary/VocabularyDetailScreenFactory';
import { VocabularyDetailScreen } from './VocabularyDetailScreen';
import { VocabularyDetailScreenStyle } from './VocabularyDetailScreenContainer.style';

export interface VocabularyDetailScreenPassedProps {
  readonly vocabulary: Vocabulary;
}

@observer
export class VocabularyDetailScreenContainer extends Container<
  VocabularyDetailScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? VocabularyDetailScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : VocabularyDetailScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new VocabularyDetailScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableVocabularyDetailScreen(
    this.props.observableConverter.convertToObservableVocabulary(
      this.props.passedProps.vocabulary,
    ),
    ActivityState.INACTIVE,
    ScreenName.VOCABULARY_DETAIL_SCREEN,
    new ObservableTitleTopBar(
      'Detail',
      new ObservableTopBarButton(
        VocabularyDetailScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.pop();
        },
      ),
      new ObservableTopBarButton(
        VocabularyDetailScreenIds.ACTION_BTN,
        null,
        {
          light: Images.HORIZONTAL_DOTS_BLACK_22X22,
          dark: Images.HORIZONTAL_DOTS_MILK_22X22,
        },
        (): void => {
          this.screenDelegate.showVocabularyActionMenu(
            this.observableScreen.vocabulary,
          );
        },
      ),
    ),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? VocabularyDetailScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : VocabularyDetailScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <VocabularyDetailScreen
        setStore={this.props.rootStore.setStore}
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
