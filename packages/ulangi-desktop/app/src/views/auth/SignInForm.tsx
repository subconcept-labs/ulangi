import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { InputField } from './InputField';
import {
  BottomContainer,
  FormContainer,
  Touchable,
  TouchableText,
} from './SignInForm.style';
import { SubmitButton } from './SubmitButton';

export interface SignInFormProps {
  email: IObservableValue<string>;
  password: IObservableValue<string>;
  submit: () => void;
  navigateToSignUpScreen: () => void;
  navigateToForgotPasswordScreen: () => void;
}

export const SignInForm = observer(
  (props: SignInFormProps): React.ReactElement => (
    <FormContainer>
      <InputField value={props.email} placeholder="Email" />
      <InputField
        value={props.password}
        placeholder="Password"
        secureTextEntry={true}
      />
      <SubmitButton
        buttonText="Sign in"
        onSubmit={props.submit}
        style={{ marginTop: '10px' }}
      />
      <BottomContainer>
        <Touchable onClick={props.navigateToForgotPasswordScreen}>
          <TouchableText>Forgot password</TouchableText>
        </Touchable>
        <Touchable onClick={props.navigateToSignUpScreen}>
          <TouchableText>{"Sign up. It's free"}</TouchableText>
        </Touchable>
      </BottomContainer>
    </FormContainer>
  ),
);
