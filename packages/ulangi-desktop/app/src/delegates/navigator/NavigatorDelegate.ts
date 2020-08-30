import { LightBoxState, ScreenName } from '@ulangi/ulangi-common/enums';
import {
  ObservableLightBox,
  ObservableNavigationComponent,
  ObservableNavigationTabBasedComponent,
  ObservableRootNavigation,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { observable, when } from 'mobx';

import { Images } from '../../constants/Images';
import { ScreenContainers } from '../../constants/ScreenContainers';
import { ExtractPassedProps } from '../../types/ExtractPassedProps';

@boundClass
export class NavigatorDelegate {
  private static isWaitingToShowLightBox: boolean = false;
  private static isWaitingToDismissLightBox: boolean = false;

  private rootNavigation: ObservableRootNavigation;
  private observableLightBox: ObservableLightBox;

  public constructor(
    rootNavigation: ObservableRootNavigation,
    observableLightBox: ObservableLightBox,
  ) {
    this.rootNavigation = rootNavigation;
    this.observableLightBox = observableLightBox;
  }

  public push<T extends keyof typeof ScreenContainers>(
    screenName: T,
    passProps: ExtractPassedProps<typeof ScreenContainers[T]>,
  ): void {
    if (!this.rootNavigation.stack.contains(screenName)) {
      this.rootNavigation.stack.components.push(
        new ObservableNavigationComponent(screenName, passProps),
      );
    }
  }

  public dismissScreen(): void {
    this.rootNavigation.stack.components.pop();
  }

  public showLightBox<T extends keyof typeof ScreenContainers>(
    screenName: T,
    passedProps: ExtractPassedProps<typeof ScreenContainers[T]>,
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

          this.rootNavigation.stack.lightBox = new ObservableNavigationComponent(
            screenName,
            passedProps,
          );
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
              this.rootNavigation.stack.lightBox = null;
            },
          );
        },
      );
    }
  }

  public resetToSingleScreen<T extends keyof typeof ScreenContainers>(
    screenName: T,
    passProps: ExtractPassedProps<typeof ScreenContainers[T]>,
  ): void {
    this.rootNavigation.stack.components.replace([
      new ObservableNavigationComponent(screenName, passProps),
    ]);
    this.rootNavigation.stack.lightBox = null;
  }

  public resetToMainTabBasedScreen(): void {
    this.rootNavigation.stack.components.replace([
      new ObservableNavigationTabBasedComponent(
        ScreenName.MAIN_TAB_BASED_SCREEN,
        {},
        observable.array([
          new ObservableNavigationComponent(
            ScreenName.MANAGE_SCREEN,
            {},
            'Manage',
            Images.MANAGE2_WHITE_24X24,
          ),
          new ObservableNavigationComponent(
            ScreenName.DISCOVER_SCREEN,
            {},
            'Discover',
            Images.DISCOVER_WHITE_24X24,
          ),
          new ObservableNavigationComponent(
            ScreenName.LEARN_SCREEN,
            {},
            'Learn',
            Images.LEARN_WHITE_24X24,
          ),
          new ObservableNavigationComponent(
            ScreenName.PROGRESS_SCREEN,
            {},
            'Progress',
            Images.PROGRESS_WHITE_24X24,
          ),
          new ObservableNavigationComponent(
            ScreenName.MORE_SCREEN,
            {},
            'More',
            Images.MORE_WHITE_24X24,
          ),
        ]),
        0,
      ),
    ])
    this.rootNavigation.stack.lightBox = null;
  }
}
