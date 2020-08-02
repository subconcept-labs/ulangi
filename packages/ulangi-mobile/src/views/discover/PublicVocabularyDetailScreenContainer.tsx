/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ActivityState, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { PublicVocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  ObservablePublicVocabularyDetailScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { PublicVocabularyDetailScreenIds } from '../../constants/ids/PublicVocabularyDetailScreenIds';
import { PublicVocabularyDetailScreenFactory } from '../../factories/discover/PublicVocabularyDetailScreenFactory';
import { PublicVocabularyDetailScreen } from './PublicVocabularyDetailScreen';
import { PublicVocabularyDetailScreenStyle } from './PublicVocabularyDetailScreenContainer.style';

export interface PublicVocabularyDetailScreenPassedProps {
  readonly vocabulary: PublicVocabulary;
}

@observer
export class PublicVocabularyDetailScreenContainer extends Container<
  PublicVocabularyDetailScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? PublicVocabularyDetailScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : PublicVocabularyDetailScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new PublicVocabularyDetailScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservablePublicVocabularyDetailScreen(
    this.props.observableConverter.convertToObservablePublicVocabulary(
      this.props.passedProps.vocabulary,
    ),
    ActivityState.INACTIVE,
    'unknown',
    this.props.componentId,
    ScreenName.PUBLIC_VOCABULARY_DETAIL_SCREEN,
    new ObservableTitleTopBar(
      'Detail',
      new ObservableTopBarButton(
        PublicVocabularyDetailScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.dismissScreen();
        },
      ),
      null,
    ),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? PublicVocabularyDetailScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : PublicVocabularyDetailScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <PublicVocabularyDetailScreen
        setStore={this.props.rootStore.setStore}
        themeStore={this.props.rootStore.themeStore}
        observableDimensions={this.props.observableDimensions}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
