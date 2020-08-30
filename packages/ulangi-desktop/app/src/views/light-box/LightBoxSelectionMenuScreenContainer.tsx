/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ObservableScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { ScreenFactory } from '../../factories/ScreenFactory';
import { LightBoxSelectionMenuScreen } from './LightBoxSelectionMenuScreen';

@observer
export class LightBoxSelectionMenuScreenContainer extends Container {

  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.LIGHT_BOX_SELECTION_MENU_SCREEN,
    null,
  );

  private screenFactory = new ScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  public componentWillUnmount(): void {
    if (
      this.props.observableLightBox.selectionMenu !== null &&
      typeof this.props.observableLightBox.selectionMenu.onClose !== 'undefined'
    ) {
      this.props.observableLightBox.selectionMenu.onClose();
    }
  }

  public render(): React.ReactElement {
    return (
      <LightBoxSelectionMenuScreen
        observableLightBox={this.props.observableLightBox}
        observableScreen={this.observableScreen}
        close={(): void => this.navigatorDelegate.dismissLightBox()}
      />
    );
  }
}
