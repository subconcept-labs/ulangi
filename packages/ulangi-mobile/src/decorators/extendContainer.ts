/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Constructor } from '@ulangi/extended-types';
import { Navigation } from '@ulangi/react-native-navigation';
import { LightBoxState, ScreenState, Theme } from '@ulangi/ulangi-common/enums';

import { Container } from '../Container';

export function extendContainer<T extends Constructor<Container>>(
  constructor: T,
): T {
  return class extends constructor {
    public constructor(...args: any[]) {
      super(...args);
      const containerOptions = this.getContainerOptions();

      if (containerOptions.autoBindNavigationEvent === true) {
        Navigation.events().bindComponent(this);
      }
      if (containerOptions.autoUpdateObservableScreen === true) {
        if (typeof this.observableScreen !== 'undefined') {
          this.props.observableScreenRegistry.screenList.push(
            this.observableScreen,
          );
        }
      }

      if (containerOptions.autoUpdateObservableLightBox === true) {
        if (typeof this.observableLightBox !== 'undefined') {
          this.observableLightBox.componentId = this.props.componentId;
        }
      }
    }

    public componentDidMount(): void {
      if (typeof super.componentDidMount !== 'undefined') {
        super.componentDidMount();
      }

      const containerOptions = this.getContainerOptions();

      if (containerOptions.autoUpdateObservableScreen === true) {
        if (typeof this.observableScreen !== 'undefined') {
          this.observableScreen.screenState = ScreenState.MOUNTED;
        }
      }

      if (containerOptions.autoUpdateObservableLightBox === true) {
        if (typeof this.observableLightBox !== 'undefined') {
          this.observableLightBox.state = LightBoxState.MOUNTED;
        }
      }

      this.observer.reaction(
        (): Theme => this.props.rootStore.darkModeStore.theme,
        (theme): void => {
          this.onThemeChanged(theme);
        },
      );
    }

    public componentWillUnmount(): void {
      if (typeof super.componentWillUnmount !== 'undefined') {
        super.componentWillUnmount();
      }

      const containerOptions = this.getContainerOptions();

      if (containerOptions.autoUpdateObservableScreen === true) {
        if (typeof this.observableScreen !== 'undefined') {
          this.observableScreen.screenState = ScreenState.UNMOUNTED;
          this.props.observableScreenRegistry.removeByScreenName(
            this.observableScreen.screenName,
          );
        }
      }

      if (containerOptions.autoUpdateObservableLightBox === true) {
        if (typeof this.observableLightBox !== 'undefined') {
          this.observableLightBox.componentId = null;
          this.observableLightBox.state = LightBoxState.UNMOUNTED;
        }
      }

      if (containerOptions.autoUnsubscribeEventBus === true) {
        this.eventBus.unsubscribeAll();
      }

      if (containerOptions.autoUnsubscribeObserver === true) {
        this.observer.unsubscribeAll();
      }
    }
  };
}
