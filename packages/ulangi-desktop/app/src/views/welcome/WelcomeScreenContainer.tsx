import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ObservableScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { WelcomeScreenFactory } from '../../factories/welcome/WelcomeScreenFactory';
import { WelcomeScreen } from './WelcomeScreen';

@observer
export class WelcomeScreenContainer extends Container {
  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.WELCOME_SCREEN,
    null,
  );

  private screenFactory = new WelcomeScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private screenDelegate = this.screenFactory.createScreenDelegate();

  public render(): React.ReactElement<any> {
    return (
      <WelcomeScreen
        themeStore={this.props.rootStore.themeStore}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
