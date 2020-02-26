/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ObservableFlashcardPlayerScreen } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Platform } from 'react-native';

import { Container } from '../../Container';
import { FlashcardPlayerScreenFactory } from '../../factories/flashcard-player/FlashcardPlayerScreenFactory';
import { FlashcardPlayerStyle } from '../../styles/FlashcardPlayerStyle';
import { FlashcardPlayerScreen } from './FlashcardPlayerScreen';
import { FlashcardPlayerScreenStyle } from './FlashcardPlayerScreenContainer.style';

export interface FlashcardPlayerScreenPassedProps {
  readonly selectedCategoryNames: undefined | string[];
}

@observer
export class FlashcardPlayerScreenContainer extends Container<
  FlashcardPlayerScreenPassedProps
> {
  public static options(): Options {
    // On iOS, we allow status bar to show at first, then hide it in componentDidAppear
    return FlashcardPlayerStyle.getScreenStyle(FlashcardPlayerScreenStyle);
  }

  public componentDidAppear(): void {
    if (Platform.OS === 'ios') {
      this.navigatorDelegate.mergeOptions({
        statusBar: {
          visible: false,
          style: 'light',
        },
      });
    }
  }

  private screenFactory = new FlashcardPlayerScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableFlashcardPlayerScreen(
    typeof this.props.passedProps.selectedCategoryNames !== 'undefined'
      ? observable.array(this.props.passedProps.selectedCategoryNames.slice())
      : undefined,
    this.props.componentId,
    ScreenName.FLASHCARD_PLAYER_SCREEN,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(): void {
    _.noop();
  }

  public render(): React.ReactElement<any> {
    return (
      <FlashcardPlayerScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
