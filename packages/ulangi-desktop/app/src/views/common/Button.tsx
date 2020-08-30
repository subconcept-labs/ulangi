import { ButtonStyles } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  styles?: ButtonStyles;
  onPress?: () => void;
  disabled?: boolean;
}

export const Button = observer(
  (props: ButtonProps): React.ReactElement => {
    const disabledTextStyle =
      props.disabled === true &&
      typeof props.styles !== 'undefined' &&
      typeof props.styles.disabledTextStyle !== 'undefined'
        ? props.styles.disabledTextStyle
        : {};

    const disabledButtonStyle =
      props.disabled === true &&
      typeof props.styles !== 'undefined' &&
      typeof props.styles.disabledButtonStyle !== 'undefined'
        ? props.styles.disabledButtonStyle
        : {};

    return (
      <button
        style={_.merge(
          {
            justifyContent: 'center',
            alignItems: 'center',
          },
          props.styles && props.styles.buttonStyle,
          disabledButtonStyle,
        )}
        onClick={props.onPress}
        {...props}
      >
        <span
          style={_.merge(
            {},
            props.styles && props.styles.textStyle,
            disabledTextStyle,
          )}>
          {props.text}
        </span>
      </button>
    );
  },
);
