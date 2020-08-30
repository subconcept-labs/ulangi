import { ObservableThemeStore } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { WelcomeScreenDelegate } from '../../delegates/welcome/WelcomeScreenDelegate';
import { SubmitButton } from '../auth/SubmitButton';
import { Logo } from '../common/Logo';
import {
  FormContainer,
  LogoContainer,
  Screen,
  Title,
  TitleContainer,
} from './WelcomeScreen.style';

export interface WelcomeScreenProps {
  themeStore: ObservableThemeStore;
  screenDelegate: WelcomeScreenDelegate;
}

export const WelcomeScreen = observer(
  (props: WelcomeScreenProps): React.ReactElement => (
    <Screen>
      <FormContainer>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <TitleContainer>
          <Title>Hi there!</Title>
          <Title>Are you new to Ulangi?</Title>
        </TitleContainer>
        <SubmitButton
          buttonText="Yes. I'm a new user."
          style={{ backgroundColor: '#64d392' }}
          textStyle={{ color: '#fff' }}
          onSubmit={props.screenDelegate.signInAsGuest}
        />
        <SubmitButton
          buttonText="No. I have an account."
          style={{ marginTop: '10px', marginBottom: '20px' }}
          onSubmit={props.screenDelegate.navigateToSignInScreen}
        />
      </FormContainer>
    </Screen>
  ),
);
