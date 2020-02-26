/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Navigation, Options } from '@ulangi/react-native-navigation';
import { LightBoxState, ScreenName } from '@ulangi/ulangi-common/enums';
import { SelectionMenu } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableLightBox,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { debounce } from 'lodash-decorators';
import { when } from 'mobx';
import { BackHandler, Platform } from 'react-native';

import { ScreenContainers } from '../../constants/ScreenContainers';
import { ExtractPassedProps } from '../../types/ExtractPassedProps';

export class NavigatorDelegate {
  private static isWaitingToShowLightBox: boolean = false;
  private static isWaitingToDismissLightBox: boolean = false;

  private componentId: string;
  private observableLightBox: ObservableLightBox;
  private themeStore: ObservableThemeStore;

  public constructor(
    componentId: string,
    observableLightBox: ObservableLightBox,
    themeStore: ObservableThemeStore,
  ) {
    this.componentId = componentId;
    this.observableLightBox = observableLightBox;
    this.themeStore = themeStore;
  }

  public mergeOptions(options: any): void {
    Navigation.mergeOptions(this.componentId, options);
  }

  public push<T extends keyof typeof ScreenContainers>(
    screenName: T,
    passProps: ExtractPassedProps<typeof ScreenContainers[T]>,
    options?: Options,
  ): void {
    // On iOS, we use push
    // On Android, we use showModal because it has better animation
    if (Platform.OS === 'ios') {
      this.debouncedPush(screenName, passProps, options);
    } else {
      this.debouncedShowModal(screenName, passProps, options);
    }
  }

  public resetTo<T extends keyof typeof ScreenContainers>(
    screenName: T,
    passProps: ExtractPassedProps<typeof ScreenContainers[T]>,
    options?: Options,
  ): void {
    Navigation.setStackRoot(this.componentId, {
      component: {
        name: screenName,
        passProps: {
          theme: this.themeStore.theme,
          get passedProps(): ExtractPassedProps<typeof ScreenContainers[T]> {
            return passProps;
          },
        },
        options,
      },
    });
  }

  public pop(): void {
    if (Platform.OS === 'ios') {
      this.debouncedPop();
    } else {
      this.debouncedDismissModel();
    }
  }

  public showLightBox<T extends keyof typeof ScreenContainers>(
    screenName: T,
    passProps: ExtractPassedProps<typeof ScreenContainers[T]>,
    styles: {
      light: Options;
      dark: Options;
    },
  ): void {
    if (
      NavigatorDelegate.isWaitingToShowLightBox === false &&
      (this.observableLightBox.state === LightBoxState.UNMOUNTED ||
        this.observableLightBox.state === LightBoxState.WILL_DISMISS)
    ) {
      NavigatorDelegate.isWaitingToShowLightBox =
        this.observableLightBox.state === LightBoxState.WILL_DISMISS;

      when(
        (): boolean =>
          NavigatorDelegate.isWaitingToShowLightBox === false ||
          this.observableLightBox.state === LightBoxState.UNMOUNTED,
        (): void => {
          NavigatorDelegate.isWaitingToShowLightBox = false;
          this.observableLightBox.state = LightBoxState.WILL_SHOW;

          this.handleLightBoxBackButton();

          Navigation.showOverlay({
            component: {
              name: screenName,
              passProps: {
                theme: this.themeStore.theme,
                styles,
                get passedProps(): ExtractPassedProps<
                  typeof ScreenContainers[T]
                > {
                  return passProps;
                },
              },
            },
          });
        },
      );
    }
  }

  public dismissLightBox(): void {
    if (
      NavigatorDelegate.isWaitingToDismissLightBox === false &&
      (this.observableLightBox.state === LightBoxState.WILL_SHOW ||
        this.observableLightBox.state === LightBoxState.MOUNTED)
    ) {
      NavigatorDelegate.isWaitingToDismissLightBox =
        this.observableLightBox.state === LightBoxState.WILL_SHOW;

      // Use when here instead of observer.when
      // because light box will never be dismissed
      // if screen is unmounted right after that
      when(
        // The light box will be dismissed when it's completely mounted
        (): boolean =>
          NavigatorDelegate.isWaitingToDismissLightBox === false ||
          this.observableLightBox.state === LightBoxState.MOUNTED,
        (): void => {
          NavigatorDelegate.isWaitingToDismissLightBox = false;
          this.observableLightBox.state = LightBoxState.WILL_DISMISS;
          when(
            // Dismiss only when animation has completed
            (): boolean =>
              this.observableLightBox.pendingAnimations.length === 0,
            (): void => {
              const componentId = assertExists(
                this.observableLightBox.componentId,
                'The componentId of the light box should not be null when it is mounted.',
              );
              Navigation.dismissOverlay(componentId);
            },
          );
        },
      );
    }
  }

  public showSelectionMenu(
    selectionMenu: SelectionMenu<any>,
    styles: {
      light: Options;
      dark: Options;
    },
  ): void {
    this.observableLightBox.selectionMenu = selectionMenu;
    this.showLightBox(ScreenName.LIGHT_BOX_SELECTION_MENU_SCREEN, {}, styles);
  }

  private handleLightBoxBackButton(): void {
    const handler = (): boolean => {
      if (this.observableLightBox.state === LightBoxState.MOUNTED) {
        this.dismissLightBox();
      }
      return true;
    };

    when(
      (): boolean => this.observableLightBox.state === LightBoxState.WILL_SHOW,
      (): void => {
        BackHandler.addEventListener('hardwareBackPress', handler);
      },
    );

    when(
      (): boolean => this.observableLightBox.state === LightBoxState.UNMOUNTED,
      (): void => {
        BackHandler.removeEventListener('hardwareBackPress', handler);
      },
    );
  }

  @debounce(500, { leading: true, trailing: false })
  private debouncedPush<T extends keyof typeof ScreenContainers>(
    screenName: T,
    passProps: ExtractPassedProps<typeof ScreenContainers[T]>,
    options?: Options,
  ): void {
    Navigation.push(this.componentId, {
      component: {
        name: screenName,
        passProps: {
          theme: this.themeStore.theme,
          // WORKAROUND FOR BUG:
          // We wrap passedProps inside a getter because
          // react-native-navigation cannot pass observables directly.
          get passedProps(): ExtractPassedProps<typeof ScreenContainers[T]> {
            return passProps;
          },
        },
        options,
      },
    });
  }

  @debounce(500, { leading: true, trailing: false })
  private debouncedShowModal<T extends keyof typeof ScreenContainers>(
    screenName: T,
    passProps: ExtractPassedProps<typeof ScreenContainers[T]>,
    options?: Options,
  ): void {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: screenName,
              passProps: {
                theme: this.themeStore.theme,
                get passedProps(): ExtractPassedProps<
                  typeof ScreenContainers[T]
                > {
                  return passProps;
                },
              },
              options,
            },
          },
        ],
      },
    });
  }

  @debounce(500, { leading: true, trailing: false })
  private debouncedPop(): void {
    Navigation.pop(this.componentId);
  }

  @debounce(500, { leading: true, trailing: false })
  private debouncedDismissModel(): void {
    Navigation.dismissModal(this.componentId);
  }
}
