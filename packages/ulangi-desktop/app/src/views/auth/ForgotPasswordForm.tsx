import { observer } from 'mobx-react';
import { IObservableValue } from "mobx";
import * as React from 'react';

import {
  BottomContainer,
  Form,
  Touchable,
  TouchableText,
} from './ForgotPasswordForm.style';
import { InputField } from './InputField';
import { SubmitButton } from './SubmitButton';

export interface ForgotPasswordFormProps {
  email: IObservableValue<string>,
  submit: () => void,
  back: () => void
}

export const ForgotPasswordForm = observer(
  (props: ForgotPasswordFormProps): React.ReactElement => (
    <Form>
      <InputField value={props.email} placeholder="Email" />
      <SubmitButton
        buttonText="Submit"
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
