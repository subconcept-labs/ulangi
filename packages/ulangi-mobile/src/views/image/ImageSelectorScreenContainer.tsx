/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ActivityState, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableImageSelectorScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Keyboard } from 'react-native';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { ImageSelectorScreenIds } from '../../constants/ids/ImageSelectorScreenIds';
import { ImageSelectorScreenFactory } from '../../factories/image/ImageSelectorScreenFactory';
import { ImageSelectorScreen } from './ImageSelectorScreen';
import { ImageSelectorScreenStyle } from './ImageSelectorScreenContainer.style';

export interface ImageSelectorScreenPassedProps {
  onSelect: (urls: string[]) => void;
}

@observer
export class ImageSelectorScreenContainer extends Container<
  ImageSelectorScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? ImageSelectorScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : ImageSelectorScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableImageSelectorScreen(
    observable.box(''),
    observable.box(ActivityState.INACTIVE),
    null,
    observable.box(false),
    observable.box(false),
    ScreenName.IMAGE_SELECTOR_SCREEN,
    new ObservableTitleTopBar(
      'Select Images',
      new ObservableTopBarButton(
        ImageSelectorScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.pop();
        },
      ),
      new ObservableTopBarButton(
        ImageSelectorScreenIds.DONE_BTN,
        'Done',
        null,
        (): void => {
          Keyboard.dismiss();
          this.screenDelegate.uploadImages(this.props.passedProps.onSelect);
        },
      ),
    ),
  );

  private screenFactory = new ImageSelectorScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? ImageSelectorScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : ImageSelectorScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ImageSelectorScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
