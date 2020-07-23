/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import {
  ContactUsFormType,
  ScreenName,
  Theme,
} from '@ulangi/ulangi-common/enums';
import {
  ObservableContactUsScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Keyboard } from 'react-native';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { ContactUsScreenIds } from '../../constants/ids/ContactUsScreenIds';
import { ContactUsScreenFactory } from '../../factories/contact-us/ContactUsScreenFactory';
import { ContactUsScreen } from './ContactUsScreen';
import { ContactUsScreenStyle } from './ContactUsScreenContainer.style';

export interface ContactUsScreenPassedProps {
  initialFormType: ContactUsFormType;
  message?: string;
}

@observer
export class ContactUsScreenContainer extends Container<
  ContactUsScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? ContactUsScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : ContactUsScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new ContactUsScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableContactUsScreen(
    this.props.passedProps.initialFormType,
    this.props.passedProps.message || '',
    this.props.componentId,
    ScreenName.CONTACT_US_SCREEN,
    new ObservableTitleTopBar(
      this.props.passedProps.initialFormType,
      new ObservableTopBarButton(
        ContactUsScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.dismissScreen();
        },
      ),
      new ObservableTopBarButton(
        ContactUsScreenIds.SEND_BTN,
        'Send',
        null,
        (): void => {
          Keyboard.dismiss();
          this.screenDelegate.send();
        },
      ),
    ),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? ContactUsScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : ContactUsScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ContactUsScreen
        userStore={this.props.rootStore.userStore}
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
      />
    );
  }
}
