import * as React from 'react';

import { Images } from '../../constants/Images';
import { PrimaryButton } from '../common/PrimaryButton';

export interface AddButtonProps {
  add: () => void;
}

export const AddButton = (props: AddButtonProps): React.ReactElement => (
  <PrimaryButton onClick={props.add}>
    <img src={Images.PLUS_WHITE_18X18} />
  </PrimaryButton>
);
