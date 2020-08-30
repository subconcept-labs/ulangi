import { observer } from 'mobx-react';
import * as React from 'react';

import {
  LightBoxContainer,
  TouchableBackground,
} from './LightBoxTouchableBackground.style';

export interface LightBoxTouchableBackgroundProps {
  style?: React.CSSProperties;
  enabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

export const LightBoxTouchableBackground = observer(
  (props: LightBoxTouchableBackgroundProps): React.ReactElement => (
    <LightBoxContainer style={props.style}>
      <TouchableBackground
        onClick={props.enabled === true ? props.onPress : undefined}
      />
      {props.children}
    </LightBoxContainer>
  ),
);
