/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { AtomScreenIds } from '../../constants/ids/AtomScreenIds';
import {
  atomPrimaryButtonStyles,
  atomSecondaryButtonStyles,
} from '../../styles/AtomStyles';
import { DefaultButton } from '../common/DefaultButton';
import { AtomMenuStyles, atomMenuResponsiveStyles } from './AtomMenu.style';

export interface AtomMenuProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  start: () => void;
  goToTutorial: () => void;
}

@observer
export class AtomMenu extends React.Component<AtomMenuProps> {
  private get styles(): AtomMenuStyles {
    return atomMenuResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <DefaultButton
          testID={AtomScreenIds.PLAY_BTN}
          text="PLAY"
          styles={atomPrimaryButtonStyles.compile(
            this.props.screenLayout,
            this.props.theme,
          )}
          onPress={this.props.start}
        />
        <DefaultButton
          testID={AtomScreenIds.TUTORIAL_BTN}
          text="TUTORIAL"
          styles={atomSecondaryButtonStyles.compile(
            this.props.screenLayout,
            this.props.theme,
          )}
          onPress={this.props.goToTutorial}
        />
      </View>
    );
  }
}
