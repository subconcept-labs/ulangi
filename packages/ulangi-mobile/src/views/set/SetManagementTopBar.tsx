/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SetStatus, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { config } from '../../constants/config';
import { SetManagementScreenIds } from '../../constants/ids/SetManagementScreenIds';
import { DefaultText } from '../common/DefaultText';
import {
  SetManagementTopBarStyles,
  setManagementTopBarResponsiveStyles,
} from './SetManagementTopBar.style';

export interface SetManagementTopBarProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  selectedSetStatus: SetStatus;
  selectSetStatus: (setStatus: SetStatus) => void;
  styles?: {
    light: SetManagementTopBarStyles;
    dark: SetManagementTopBarStyles;
  };
}

@observer
export class SetManagementTopBar extends React.Component<
  SetManagementTopBarProps
> {
  public get styles(): SetManagementTopBarStyles {
    return setManagementTopBarResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.top_bar_container}>
        {_.map(
          config.set.statusMap,
          ({ name }, setStatus: SetStatus): React.ReactElement<any> => {
            const isSelected =
              this.props.selectedSetStatus === setStatus ? true : false;
            const selectedContainerStyle = isSelected
              ? this.styles.selectedContainerStyle
              : {};
            const selectedTextStyle = isSelected
              ? this.styles.selectedTextStyle
              : {};
            return (
              <TouchableOpacity
                testID={SetManagementScreenIds.SELECT_TAB_BTN_BY_SET_STATUS(
                  name,
                )}
                key={setStatus}
                onPress={(): void => this.props.selectSetStatus(setStatus)}
                style={[this.styles.text_container, selectedContainerStyle]}>
                <DefaultText style={[this.styles.text, selectedTextStyle]}>
                  {_.upperFirst(name)}
                </DefaultText>
              </TouchableOpacity>
            );
          },
        )}
      </View>
    );
  }
}
