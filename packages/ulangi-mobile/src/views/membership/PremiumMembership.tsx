/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableUpgradeButtonState,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { MembershipLabel } from './MembershipLabel';
import { MembershipTitle } from './MembershipTitle';
import { PremiumFeatureList } from './PremiumFeatureList';
import {
  PremiumMembershipStyles,
  premiumMembershipResponsiveStyles,
} from './PremiumMembership.style';
import { UpgradeButton } from './UpgradeButton';

export interface PremiumMembershipProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  isPremium: boolean;
  upgradeButtonState: ObservableUpgradeButtonState;
  navigateToFeatureRequest: () => void;
}

@observer
export class PremiumMembership extends React.Component<PremiumMembershipProps> {
  private get styles(): PremiumMembershipStyles {
    return premiumMembershipResponsiveStyles.compile(
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
            label={
              this.props.isPremium === true
                ? 'CURRENT ACCOUNT TYPE'
                : 'UPGRADE TO'
            }
          />
          <MembershipTitle
            theme={this.props.theme}
            screenLayout={this.props.screenLayout}
            title="PREMIUM"
          />
        </View>
        <View style={this.styles.feature_list_container}>
          <PremiumFeatureList
            theme={this.props.theme}
            screenLayout={this.props.screenLayout}
          />
        </View>
        {this.props.isPremium === true ? (
          <>
            <View style={this.styles.thank_you_container}>
              <DefaultText style={this.styles.note}>
                Thank you for using our app.
              </DefaultText>
            </View>
            <TouchableOpacity
              style={this.styles.feature_request_btn}
              onPress={this.props.navigateToFeatureRequest}
              hitSlop={{ top: 10, bottom: 10 }}>
              <DefaultText style={this.styles.highlighted}>
                Have a feature request?
              </DefaultText>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={this.styles.button_container}>
              <UpgradeButton
                theme={this.props.theme}
                screenLayout={this.props.screenLayout}
                upgradeButtonState={this.props.upgradeButtonState}
              />
            </View>
            <View style={this.styles.note_container}>
              <DefaultText style={this.styles.note}>
                This upgrade will apply to the current Ulangi account.
              </DefaultText>
            </View>
          </>
        )}
      </View>
    );
  }
}
