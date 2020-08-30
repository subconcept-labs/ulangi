/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableLightBox,
  ObservableScreen,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Screen } from './LightBoxSelectionMenuScreen.style';
import { LightBoxAnimatableView } from './LightBoxAnimatableView';
import { LightBoxSelectionMenu } from './LightBoxSelectionMenu';
import { LightBoxTouchableBackground } from './LightBoxTouchableBackground';

export interface LightBoxSelectionMenuScreenProps {
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableScreen;
  close: () => void
}

export const LightBoxSelectionMenuScreen = observer((props: LightBoxSelectionMenuScreenProps): null | React.ReactElement => {

  if (props.observableLightBox.selectionMenu === null) {
    return null;
  } else {
    return (
      <Screen>
        <LightBoxTouchableBackground
          style={{ padding: '100px 16px' }}
          enabled={true}
          onPress={props.close}>
          <LightBoxAnimatableView>
            <LightBoxSelectionMenu
              selectionMenu={props.observableLightBox.selectionMenu}
            />
          </LightBoxAnimatableView>
        </LightBoxTouchableBackground>
      </Screen>
    );
  }
})
