import { ObservableSignInScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { SignInScreenDelegate } from '../../delegates/auth/SignInScreenDelegate';
import { Logo } from '../common/Logo';
import { SignInForm } from './SignInForm';
import {
  FormContainer,
  LogoContainer,
  Screen,
  SignInAsGuestContainer,
  SignInAsGuestNote,
  Wrapper,
} from './SignInScreen.style';
import { SubmitButton } from './SubmitButton';

export interface SignInScreenProps {
  observableScreen: ObservableSignInScreen;
  screenDelegate: SignInScreenDelegate;
}

export const SignInScreen = observer(
  (props: SignInScreenProps): React.ReactElement => (
    <Screen>
      <Wrapper>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <FormContainer>
          <SignInForm
            email={props.observableScreen.email}
            password={props.observableScreen.password}
            submit={props.screenDelegate.signIn}
            navigateToSignUpScreen={props.screenDelegate.navigateToSignUpScreen}
            navigateToForgotPasswordScreen={
              props.screenDelegate.navigateToForgotPasswordScreen
            }
          />
        </FormContainer>
        <SignInAsGuestContainer>
          <SubmitButton
            buttonText="Sign in as Guest"
            style={{ backgroundColor: '#64d392' }}
            textStyle={{ color: 'fff' }}
            onSubmit={props.screenDelegate.signInAsGuest}
          />
          <SignInAsGuestNote>You can set up account later.</SignInAsGuestNote>
        </SignInAsGuestContainer>
      </Wrapper>
    </Screen>
  ),
);
