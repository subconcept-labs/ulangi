import { ButtonProps } from '@ulangi/ulangi-common/interfaces';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Button } from '../common/Button';
import {
  ButtonContainer,
  ButtonListContainer,
} from './LightBoxButtonList.style';

export interface LightBoxButtonListProps {
  buttonList: readonly ButtonProps[];
}

export const LightBoxButtonList = observer(
  (props: LightBoxButtonListProps): null | React.ReactElement => {
    if (props.buttonList.length === 0) {
      return null;
    } else {
      return (
        <ButtonListContainer>
          {props.buttonList.map(
            (button, index): React.ReactElement<any> => {
              return (
                <ButtonContainer key={button.testID || index}>
                  <Button
                    {...button}
                    styles={button.styles ? button.styles : undefined}
                  />
                </ButtonContainer>
              );
            },
          )}
        </ButtonListContainer>
      );
    }
  },
);
