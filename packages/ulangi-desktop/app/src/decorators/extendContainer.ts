/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Constructor } from '@ulangi/extended-types';
import { LightBoxState, ScreenState } from '@ulangi/ulangi-common/enums';

import { Container } from '../Container';

export function extendContainer<T extends Constructor<Container>>(
  constructor: T,
): T {
  return class extends constructor {
    public constructor(...args: any[]) {
      super(...args);
      const containerOptions = this.getContainerOptions();

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

        // fire immediately if this current screen is on focused
        if (
          this.props.rootNavigation.stack.currentActiveComponentId ===
          this.props.componentId
        ) {
          super.componentDidAppear();
        }

        this.observer.reaction(
          (): boolean =>
            this.props.rootNavigation.stack.currentActiveComponentId ===
            this.props.componentId,
          (isActive: boolean): void => {
            if (isActive) {
              super.componentDidAppear();
            } else if (!isActive) {
              super.componentDidDisaappear();
            }
          },
        );
      }

      if (containerOptions.autoUpdateObservableLightBox === true) {
        if (typeof this.observableLightBox !== 'undefined') {
          this.observableLightBox.state = LightBoxState.MOUNTED;
        }
      }
    }

    public componentWillUnmount(): void {
      if (typeof super.componentWillUnmount !== 'undefined') {
        super.componentWillUnmount();
      }

      const containerOptions = this.getContainerOptions();

      if (containerOptions.autoUpdateObservableScreen === true) {
        if (typeof this.observableScreen !== 'undefined') {
          this.observableScreen.screenState = ScreenState.UNMOUNTED;
          this.props.observableScreenRegistry.removeByComponentId(
            this.observableScreen.componentId,
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
