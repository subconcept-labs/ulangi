/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Navigation, OptionsBottomTabs } from '@ulangi/react-native-navigation';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ObservableDarkModeStore } from '@ulangi/ulangi-observable';

import { Images } from '../../constants/Images';
import { BottomTabIds } from '../../constants/ids/BottomTabIds';
import { BottomTabsStyle } from '../../styles/BottomTabsStyle';

export class RootScreenDelegate {
  private darkModeStore: ObservableDarkModeStore;

  public constructor(darkModeStore: ObservableDarkModeStore) {
    this.darkModeStore = darkModeStore;
  }

  public setRootToSingleScreen(screenName: ScreenName): void {
    const theme = this.darkModeStore.theme;
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: screenName,
                passProps: { theme },
              },
            },
          ],
        },
      },
    });
  }

  public setRootToTabBasedScreen(): void {
    const theme = this.darkModeStore.theme;
    Navigation.setRoot({
      root: {
        bottomTabs: {
          id: BottomTabIds.CONTAINER,
          children: [
            {
              stack: {
                children: [
                  {
                    component: {
                      name: ScreenName.MANAGE_SCREEN,
                      passProps: { theme },
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    testID: BottomTabIds.MANAGE_BTN,
                    text: 'Manage',
                    icon: Images.MANAGE_GREY_25X25,
                    selectedIcon: Images.MANAGE_BLUE_25X25,
                  },
                },
              },
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      name: ScreenName.DISCOVER_SCREEN,
                      passProps: { theme },
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    testID: BottomTabIds.DISCOVER_BTN,
                    text: 'Discover',
                    icon: Images.DISCOVER_GREY_25X25,
                    selectedIcon: Images.DISCOVER_BLUE_25X25,
                  },
                },
              },
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      name: ScreenName.LEARN_SCREEN,
                      passProps: { theme },
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    testID: BottomTabIds.LEARN_BTN,
                    text: 'Learn',
                    icon: Images.LEARN_GREY_25X25,
                    selectedIcon: Images.LEARN_BLUE_25X25,
                  },
                },
              },
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      name: ScreenName.PLAY_SCREEN,
                      passProps: { theme },
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    testID: BottomTabIds.PLAY_BTN,
                    text: 'Play',
                    icon: Images.PLAY_GREY_25X25,
                    selectedIcon: Images.PLAY_BLUE_25X25,
                  },
                },
              },
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      name: ScreenName.MORE_SCREEN,
                      passProps: { theme },
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    testID: BottomTabIds.MORE_BTN,
                    text: 'More',
                    icon: Images.MORE_GREY_25X25,
                    selectedIcon: Images.MORE_BLUE_25X25,
                  },
                },
              },
            },
          ],
          options: {
            bottomTabs: {
              backgroundColor: BottomTabsStyle.getBackgroundColor(theme),
            },
          },
        },
      },
    });
  }

  public mergeBottomTabsOptions(options: OptionsBottomTabs): void {
    Navigation.mergeOptions(BottomTabIds.CONTAINER, {
      bottomTabs: options,
    });
  }
}
