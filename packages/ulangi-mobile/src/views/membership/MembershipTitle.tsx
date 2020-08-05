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

import { DefaultText } from '../common/DefaultText';
import {
  MembershipTitleStyles,
  membershipTitleResponsiveStyles,
} from './MembershipTitle.style';

export interface MembershipTitleProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  title: 'PREMIUM' | 'FREE';
}

@observer
export class MembershipTitle extends React.Component<MembershipTitleProps> {
  private get styles(): MembershipTitleStyles {
    return membershipTitleResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }
  public render(): null | React.ReactElement<any> {
    return (
      <DefaultText allowFontScaling={false} style={this.styles.title}>
        {this.props.title}
      </DefaultText>
    );
  }
}
