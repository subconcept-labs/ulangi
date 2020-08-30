import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ObservableScreen } from '@ulangi/ulangi-observable';
import * as React from 'react';

import { Container } from '../../Container';
import { ScreenFactory } from '../../factories/ScreenFactory';
import { LightBoxDialogScreen } from './LightBoxDialogScreen';

export class LightBoxDialogScreenContainer extends Container {
  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.LIGHT_BOX_DIALOG_SCREEN,
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
      this.observableLightBox.dialog !== null &&
      typeof this.observableLightBox.dialog.onClose !== 'undefined'
    ) {
      this.observableLightBox.dialog.onClose();
    }
  }

  public render(): React.ReactElement {
    return (
      <LightBoxDialogScreen
        observableLightBox={this.observableLightBox}
        observableScreen={this.observableScreen}
        navigatorDelegate={this.navigatorDelegate}
      />
    );
  }
}
