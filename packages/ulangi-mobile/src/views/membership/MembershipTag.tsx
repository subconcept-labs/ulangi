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
  MembershipTagStyles,
  membershipTagResponsiveStyles,
} from './MembershipTag.style';

export interface MembershipTagProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  text: string;
  textColor: string;
}

@observer
export class MembershipTag extends React.Component<MembershipTagProps> {
  private get styles(): MembershipTagStyles {
    return membershipTagResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.tag_container}>
        <DefaultText
          allowFontScaling={false}
          style={[this.styles.tag_text, { color: this.props.textColor }]}>
          {this.props.text}
        </DefaultText>
      </View>
    );
  }
}
