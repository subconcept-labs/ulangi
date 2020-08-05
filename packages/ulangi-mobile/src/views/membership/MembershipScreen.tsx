/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableMembershipScreen,
  ObservableThemeStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { MembershipScreenIds } from '../../constants/ids/MembershipScreenIds';
import { MembershipScreenDelegate } from '../../delegates/membership/MembershipScreenDelegate';
import { Screen } from '../common/Screen';
import {
  MembershipScreenStyles,
  membershipScreenResponsiveStyles,
} from './MembershipScreen.style';
import { PremiumMembership } from './PremiumMembership';
import { RegularMembership } from './RegularMembership';

export interface MembershipScreenProps {
  themeStore: ObservableThemeStore;
  userStore: ObservableUserStore;
  screenDelegate: MembershipScreenDelegate;
  observableScreen: ObservableMembershipScreen;
}

@observer
export class MembershipScreen extends React.Component<MembershipScreenProps> {
  private get styles(): MembershipScreenStyles {
    return membershipScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    const isPremium = this.props.userStore.existingCurrentUser.isPremium;
    return (
      <Screen
        testID={MembershipScreenIds.SCREEN}
        style={this.styles.screen}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        <ScrollView contentContainerStyle={this.styles.content_container}>
          {isPremium === false ? (
            <RegularMembership
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              showAdsDialog={this.props.screenDelegate.showAdsDialog}
            />
          ) : null}
          <PremiumMembership
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            isPremium={isPremium}
            upgradeButtonState={this.props.observableScreen.upgradeButtonState}
            navigateToFeatureRequest={
              this.props.screenDelegate.navigateToFeatureRequestScreen
            }
          />
        </ScrollView>
      </Screen>
    );
  }
}
