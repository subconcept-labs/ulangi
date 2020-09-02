/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { WelcomeScreenIds } from '../../constants/ids/WelcomeScreenIds';
import { WelcomeScreenDelegate } from '../../delegates/welcome/WelcomeScreenDelegate';
import { Logo } from '../auth/Logo';
import { SubmitButton } from '../auth/SubmitButton';
import { DefaultText } from '../common/DefaultText';
import { ResponsiveContext } from "../../context/ResponsiveContext";
import { Screen } from '../common/Screen';
import {
  LogoContainer, TitleContainer, Title
} from './WelcomeScreen.style';

export interface WelcomeScreenProps {
  screenDelegate: WelcomeScreenDelegate;
  themeStore: ObservableThemeStore;
  observableScreen: ObservableScreen;
}

export const WelcomeScreen = observer(function(props: WelcomeScreenProps): React.ReactElement<any> {
  return (
    <Screen
      themeStore={props.themeStore}
      observableScreen={props.observableScreen}
      useSafeAreaView={true}>
      <ResponsiveContext.Consumer>
        {
          (responsive): React.ReactElement<any> => 
          <>
            <LogoContainer {...responsive}>
              <Logo />
            </LogoContainer>
            <TitleContainer {...responsive}>
              <Title>Hi there!</Title>
              <Title>
                Are you new to Ulangi?
              </Title>
            </TitleContainer>
            <SubmitButton
              testID={WelcomeScreenIds.YES_BTN}
              theme={props.themeStore.theme}
              screenLayout={props.observableScreen.screenLayout}
              buttonText="Yes. I'm a new user."
              style={{ backgroundColor: '#64d392'}}
              textStyle={{ color: "#fff"}}
              onSubmit={props.screenDelegate.signInAsGuest}
            />
            <SubmitButton
              testID={WelcomeScreenIds.NO_BTN}
              theme={props.themeStore.theme}
              screenLayout={props.observableScreen.screenLayout}
              buttonText="No. I have an account."
              style={{ 
                marginTop: responsive.scaleByFactor(10),
                marginBottom: responsive.scaleByFactor(20)
              }}
              textStyle={{}}
              onSubmit={props.screenDelegate.navigateToSignInScreen}
            />
          </>
        }
      </ResponsiveContext.Consumer>
    </Screen>
  );
})
