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

import { MembershipLabel } from './MembershipLabel';
import { MembershipTitle } from './MembershipTitle';
import { RegularFeatureList } from './RegularFeatureList';
import {
  RegularMembershipStyles,
  regularMembershipResponsiveStyles,
} from './RegularMembership.style';

export interface RegularMembershipProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  showAdsDialog: () => void;
}

@observer
export class RegularMembership extends React.Component<RegularMembershipProps> {
  private get styles(): RegularMembershipStyles {
    return regularMembershipResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.title_container}>
          <MembershipLabel
            theme={this.props.theme}
            screenLayout={this.props.screenLayout}
            label="CURRENT ACCOUNT TYPE"
          />
          <MembershipTitle
            theme={this.props.theme}
            screenLayout={this.props.screenLayout}
            title="FREE"
          />
        </View>
        <View style={this.styles.feature_list_container}>
          <RegularFeatureList
            theme={this.props.theme}
            screenLayout={this.props.screenLayout}
            showAdsDialog={this.props.showAdsDialog}
          />
        </View>
      </View>
    );
  }
}
