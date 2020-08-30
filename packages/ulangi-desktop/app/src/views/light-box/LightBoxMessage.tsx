import { observer } from 'mobx-react';
import * as React from 'react';

import { Message, MessageContainer } from './LightBoxMessage.style';

export interface LightBoxMessageProps {
  message: string;
}

export const LightBoxMessage = observer(
  (props: LightBoxMessageProps): React.ReactElement => (
    <MessageContainer>
      <Message>{props.message}</Message>
    </MessageContainer>
  ),
);
