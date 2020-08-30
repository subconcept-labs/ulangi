import { observer } from 'mobx-react';
import * as React from 'react';

import { TitleContainer, TitleText } from './LightBoxTitle.style';

export interface LightBoxTitleProps {
  title: string;
}

export const LightBoxTitle = observer(
  (props: LightBoxTitleProps): React.ReactElement => (
    <TitleContainer>
      <TitleText>{props.title.toUpperCase()}</TitleText>
    </TitleContainer>
  ),
);
