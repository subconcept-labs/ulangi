import { ObservableSignUpScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { SignUpScreenDelegate } from '../../delegates/auth/SignUpScreenDelegate';
import { Logo } from '../common/Logo';
import { SignUpForm } from './SignUpForm';
import {
  FormContainer,
  LogoContainer,
  Screen,
  Wrapper,
} from './SignUpScreen.style';

export interface SignUpScreenProps {
  observableScreen: ObservableSignUpScreen;
  screenDelegate: SignUpScreenDelegate;
}

export const SignUpScreen = observer(
  (props: SignUpScreenProps): React.ReactElement => (
    <Screen>
      <Wrapper>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <FormContainer>
          <SignUpForm
            email={props.observableScreen.email}
            password={props.observableScreen.password}
            confirmPassword={props.observableScreen.confirmPassword}
            submit={props.screenDelegate.signUp}
            back={props.screenDelegate.back}
          />
        </FormContainer>
      </Wrapper>
    </Screen>
  ),
);
