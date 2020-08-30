import { assertExists } from '@ulangi/assert';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ObservableScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { MainTabBasedScreenFactory } from '../../factories/navigation/MainTabBasedScreenFactory';
import { MainTabBasedScreen } from './MainTabBasedScreen';

@observer
export class MainTabBasedScreenContainer extends Container {
  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.MAIN_TAB_BASED_SCREEN,
    null,
  );

  private screenFactory = new MainTabBasedScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private screenDelegate = this.screenFactory.createScreenDelegate();

  public render(): React.ReactElement {
    const component = assertExists(
      this.props.rootNavigation.stack.getComponentById(this.props.componentId),
    );

    if (this.props.rootNavigation.stack.isTabBasedComponent(component)) {
      return (
        <MainTabBasedScreen
          tabBasedComponent={component}
          screenDelegate={this.screenDelegate}
        />
      );
    } else {
      throw new Error('MainTabBasedScreen requires a TabBasedComponent.');
    }
  }
}
