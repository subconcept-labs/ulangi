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

import { DefaultText } from '../common/DefaultText';
import {
  MembershipLabelStyles,
  membershipLabelResponsiveStyles,
} from './MembershipLabel.style';

export interface MembershipLabelProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  label: string;
}

@observer
export class MembershipLabel extends React.Component<MembershipLabelProps> {
  private get styles(): MembershipLabelStyles {
    return membershipLabelResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.label_container}>
        <DefaultText style={this.styles.label}>{this.props.label}</DefaultText>
      </View>
    );
  }
}
