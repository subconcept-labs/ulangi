import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Input, InputContainer } from './InputField.style';

export interface InputFieldProps {
  value: IObservableValue<string>;
  placeholder: string;
  secureTextEntry?: boolean;
  shouldFocus?: IObservableValue<boolean>;
}

export const InputField = observer(
  (props: InputFieldProps): React.ReactElement => (
    <InputContainer>
      <Input
        value={props.value.get()}
        placeholder={props.placeholder}
        onChange={(event): void => props.value.set(event.target.value)}
        type={props.secureTextEntry === true ? 'password' : 'text'}
      />
    </InputContainer>
  ),
);
