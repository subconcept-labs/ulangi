/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Navigation, Options } from '@ulangi/react-native-navigation';
import { LightBoxState, ScreenName } from '@ulangi/ulangi-common/enums';
import { Dialog, SelectionMenu } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableDarkModeStore,
  ObservableLightBox,
  Observer,
} from '@ulangi/ulangi-observable';
import { when } from 'mobx';
import { BackHandler, Platform } from 'react-native';

import { ScreenContainers } from '../../constants/ScreenContainers';
import { ExtractPassedProps } from '../../types/ExtractPassedProps';

export class NavigatorDelegate {
  private observer: Observer;
  private componentId: string;
  private observableLightBox: ObservableLightBox;
  private darkModeStore: ObservableDarkModeStore;

  public constructor(
    observer: Observer,
    componentId: string,
    observableLightBox: ObservableLightBox,
    darkModeStore: ObservableDarkModeStore
  ) {
    this.observer = observer;
    this.componentId = componentId;
    this.observableLightBox = observableLightBox;
    this.darkModeStore = darkModeStore;
  }

  public mergeOptions(options: any): void {
    Navigation.mergeOptions(this.componentId, options);
  }

  public push<T extends keyof typeof ScreenContainers>(
    screenName: T,
    passProps: ExtractPassedProps<typeof ScreenContainers[T]>,
    options?: Options
  ): void {
    // On iOS, we use push
    // On Android, we use showModal because it has better animation
    if (Platform.OS === 'ios') {
      Navigation.push(this.componentId, {
        component: {
          name: screenName,
          passProps: {
            theme: this.darkModeStore.theme,
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
    } else {
      Navigation.showModal({
        stack: {
          children: [
            {
              component: {
                name: screenName,
                passProps: {
                  theme: this.darkModeStore.theme,
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
  }

  public resetTo<T extends keyof typeof ScreenContainers>(
    screenName: T,
    passProps: ExtractPassedProps<typeof ScreenContainers[T]>,
    options?: Options
  ): void {
    Navigation.setStackRoot(this.componentId, {
      component: {
        name: screenName,
        passProps: {
          theme: this.darkModeStore.theme,
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
      Navigation.pop(this.componentId);
    } else {
      Navigation.dismissModal(this.componentId);
    }
  }

  public showLightBox<T extends keyof typeof ScreenContainers>(
    screenName: T,
    passProps: ExtractPassedProps<typeof ScreenContainers[T]>,
    styles: {
      light: Options;
      dark: Options;
    }
  ): void {
    if (
      this.observableLightBox.state === LightBoxState.UNMOUNTED ||
      this.observableLightBox.state === LightBoxState.WILL_DISMISS
    ) {
      // The light box will show only when it's completely unmounted
      this.observer.when(
        (): boolean =>
          this.observableLightBox.state === LightBoxState.UNMOUNTED,
        (): void => {
          // Do not allow showing multiple light box at the same time
          if (this.observableLightBox.state !== LightBoxState.WILL_SHOW) {
            this.observableLightBox.state = LightBoxState.WILL_SHOW;

            this.handleLightBoxBackButton();

            Navigation.showOverlay({
              component: {
                name: screenName,
                passProps: {
                  theme: this.darkModeStore.theme,
                  styles,
                  get passedProps(): ExtractPassedProps<
                    typeof ScreenContainers[T]
                  > {
                    return passProps;
                  },
                },
              },
            });
          }
        }
      );
    }
  }

  public dismissLightBox(): void {
    if (
      this.observableLightBox.state === LightBoxState.WILL_SHOW ||
      this.observableLightBox.state === LightBoxState.MOUNTED
    ) {
      // Do not use observer.when here
      // because light box will never be dismissed
      // if screen is unmounted right after that
      when(
        // The light box will be dismissed when it's completely mounted
        (): boolean => this.observableLightBox.state === LightBoxState.MOUNTED,
        (): void => {
          if (this.observableLightBox.state !== LightBoxState.WILL_DISMISS) {
            this.observableLightBox.state = LightBoxState.WILL_DISMISS;
            when(
              // Dismiss only when animation has completed
              (): boolean =>
                this.observableLightBox.pendingAnimations.length === 0,
              (): void => {
                const componentId = assertExists(
                  this.observableLightBox.componentId,
                  'The componentId of the light box should not be null when it is mounted.'
                );
                Navigation.dismissOverlay(componentId);
              }
            );
          }
        }
      );
    }
  }

  public showSelectionMenu(
    selectionMenu: SelectionMenu<any>,
    styles: {
      light: Options;
      dark: Options;
    }
  ): void {
    this.observableLightBox.selectionMenu = selectionMenu;
    this.showLightBox(ScreenName.LIGHT_BOX_SELECTION_MENU_SCREEN, {}, styles);
  }

  public showDialog(
    dialog: Dialog,
    styles: { light: Options; dark: Options }
  ): void {
    this.observableLightBox.dialog = dialog;
    this.showLightBox(ScreenName.LIGHT_BOX_DIALOG_SCREEN, {}, styles);
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
      }
    );

    when(
      (): boolean => this.observableLightBox.state === LightBoxState.UNMOUNTED,
      (): void => {
        BackHandler.removeEventListener('hardwareBackPress', handler);
      }
    );
  }
}
