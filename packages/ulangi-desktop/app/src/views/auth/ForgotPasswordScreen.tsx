import { ObservableForgotPasswordScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { ForgotPasswordScreenDelegate } from '../../delegates/auth/ForgotPasswordScreenDelegate';
import { Logo } from '../common/Logo';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import {
  FormContainer,
  LogoContainer,
  Screen,
  Wrapper,
} from './ForgotPasswordScreen.style';

export interface ForgotPasswordScreenProps {
  observableScreen: ObservableForgotPasswordScreen;
  screenDelegate: ForgotPasswordScreenDelegate;
}

export const ForgotPasswordScreen = observer(
  (props: ForgotPasswordScreenProps): React.ReactElement => (
    <Screen>
      <Wrapper>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <FormContainer>
          <ForgotPasswordForm
            email={props.observableScreen.email}
            submit={props.screenDelegate.requestResetPasswordEmail}
            back={props.screenDelegate.back}
          />
        </FormContainer>
      </Wrapper>
    </Screen>
  ),
);
