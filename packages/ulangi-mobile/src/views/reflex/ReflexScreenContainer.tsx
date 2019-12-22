/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import {
  ObservableReflexGameState,
  ObservableReflexGameStats,
  ObservableReflexScreen,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Platform } from 'react-native';

import { Container } from '../../Container';
import { config } from '../../constants/config';
import { ReflexScreenFactory } from '../../factories/reflex/ReflexScreenFactory';
import { ReflexQuestionIterator } from '../../iterators/ReflexQuestionIterator';
import { ReflexStyle } from '../../styles/ReflexStyle';
import { ReflexScreen } from './ReflexScreen';
import { ReflexScreenStyle } from './ReflexScreenContainer.style';

export interface ReflexScreenPassedProps {
  readonly selectedCategoryNames: undefined | string[];
}

@observer
export class ReflexScreenContainer extends Container<ReflexScreenPassedProps> {
  public static options(): Options {
    return ReflexStyle.getScreenStyle(ReflexScreenStyle);
  }

  private screenFactory = new ReflexScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  private questionIterator = new ReflexQuestionIterator();

  protected observableScreen = new ObservableReflexScreen(
    typeof this.props.passedProps.selectedCategoryNames !== 'undefined'
      ? observable.array(this.props.passedProps.selectedCategoryNames.slice())
      : undefined,
    new ObservableReflexGameState(false, config.reflex.timePerQuestion, false),
    new ObservableReflexGameStats(0),
    false,
    ScreenName.REFLEX_SCREEN
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
    this.questionIterator
  );

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

  public componentWillUnmount(): void {
    this.screenDelegate.clearGame();
  }

  protected onThemeChanged(): void {
    _.noop();
  }

  public render(): React.ReactElement<any> {
    return (
      <ReflexScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
