import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { InputField } from './InputField';
import {
  BottomContainer,
  Form,
  Touchable,
  TouchableText,
} from './SignUpForm.style';
import { SubmitButton } from './SubmitButton';

export interface SignUpFormProps {
  email: IObservableValue<string>;
  password: IObservableValue<string>;
  confirmPassword: IObservableValue<string>;
  submit: () => void;
  back: () => void;
}

export const SignUpForm = observer(
  (props: SignUpFormProps): React.ReactElement => (
    <Form>
      <InputField value={props.email} placeholder="Email" />
      <InputField
        value={props.password}
        placeholder="Password (min 8 characters)"
        secureTextEntry={true}
      />
      <InputField
        value={props.confirmPassword}
        placeholder="Confirm password"
        secureTextEntry={true}
      />
      <SubmitButton
        buttonText="Sign up"
        onSubmit={props.submit}
        style={{ marginTop: '10px' }}
      />
      <BottomContainer>
        <Touchable onClick={props.back}>
          <TouchableText>Back to Sign In</TouchableText>
        </Touchable>
      </BottomContainer>
    </Form>
  ),
);
