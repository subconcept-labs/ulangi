import { observer } from 'mobx-react';
import * as React from 'react';

import { Images } from '../../constants/Images';
import { Button, ButtonCaret, ButtonText } from './SetSelectionButton.style';

export interface SetSelectionButtonProps {
  currentSetName: string
  showMenu: () => void
}

export const SetSelectionButton = observer(
  (props: SetSelectionButtonProps): React.ReactElement => (
    <Button onClick={props.showMenu}>
      <ButtonText>{props.currentSetName}</ButtonText>
      <ButtonCaret src={Images.CARET_DOWN_GREY_12X12} />
    </Button>
  ),
);
