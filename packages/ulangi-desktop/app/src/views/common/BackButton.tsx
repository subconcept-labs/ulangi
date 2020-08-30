import * as React from 'react';

import { Images } from '../../constants/Images';
import { DefaultButton } from './DefaultButton';

export interface BackButtonProps {
  back: () => void;
}

export const BackButton = (props: BackButtonProps): React.ReactElement => (
  <DefaultButton onClick={props.back}>
    <img src={Images.CARET_LEFT_GREY_18X18} />
  </DefaultButton>
);
