/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ActivityState, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { ObservableVocabularyDetailScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
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
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === VocabularyDetailScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === VocabularyDetailScreenIds.ACTION_BTN) {
      this.screenDelegate.showVocabularyActionMenu(
        this.observableScreen.vocabulary,
      );
    }
  }

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
        audioStore={this.props.rootStore.audioStore}
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
