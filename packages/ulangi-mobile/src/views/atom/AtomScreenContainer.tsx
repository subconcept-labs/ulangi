/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ObservableAtomScreen } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { AtomScreenFactory } from '../../factories/atom/AtomScreenFactory';
import { AtomStyle } from '../../styles/AtomStyle';
import { AtomScreen } from './AtomScreen';

export interface AtomScreenPassedProps {
  readonly selectedCategoryNames: undefined | string[];
}

@observer
export class AtomScreenContainer extends Container<AtomScreenPassedProps> {
  public static options(): Options {
    return AtomStyle.getScreenStyle();
  }

  private atomScreenFactory = new AtomScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableAtomScreen(
    typeof this.props.passedProps.selectedCategoryNames !== 'undefined'
      ? observable.array(this.props.passedProps.selectedCategoryNames.slice())
      : undefined,
    ScreenName.ATOM_SCREEN,
  );

  private screenDelegate = this.atomScreenFactory.createScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(): void {
    _.noop();
  }

  public render(): React.ReactElement<any> {
    return (
      <AtomScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
