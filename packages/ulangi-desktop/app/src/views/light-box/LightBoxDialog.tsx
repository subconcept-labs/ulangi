import { ButtonSize } from '@ulangi/ulangi-common/enums';
import { Dialog } from '@ulangi/ulangi-common/interfaces';
import { observer } from 'mobx-react';
import * as React from 'react';

import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { LightBoxButtonList } from './LightBoxButtonList';
import { DialogContainer } from './LightBoxDialog.style';
import { LightBoxMessage } from './LightBoxMessage';
import { LightBoxTitle } from './LightBoxTitle';

export interface LightBoxDialogProps {
  dialog: Dialog;
  close: () => void;
}

export const LightBoxDialog = observer(
  (props: LightBoxDialogProps): React.ReactElement => {
    const buttonList =
      typeof props.dialog.buttonList !== 'undefined'
        ? props.dialog.buttonList.slice()
        : [];

    if (props.dialog.showCloseButton === true) {
      buttonList.unshift({
        testID: 'CLOSE_BTN',
        text: 'CLOSE',
        styles: fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
          ButtonSize.SMALL,
        ),
        onPress: props.close,
      });
    }

    return (
      <DialogContainer>
        {typeof props.dialog.title !== 'undefined' ? (
          <LightBoxTitle title={props.dialog.title} />
        ) : null}
        <LightBoxMessage message={props.dialog.message} />
        <LightBoxButtonList buttonList={buttonList} />
      </DialogContainer>
    );
  },
);
