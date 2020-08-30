import { observer } from 'mobx-react';
import * as React from 'react';

import { Button, ButtonText } from './SubmitButton.style';

export interface SubmitButtonProps {
  buttonText: string;
  onSubmit: () => void;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
}

export const SubmitButton = observer(
  (props: SubmitButtonProps): React.ReactElement => (
    <Button onClick={props.onSubmit} style={props.style}>
      <ButtonText style={props.textStyle}>{props.buttonText}</ButtonText>
    </Button>
  ),
);
