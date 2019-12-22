/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableMembershipScreen,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { MembershipScreenIds } from '../../constants/ids/MembershipScreenIds';
import { MembershipScreenDelegate } from '../../delegates/membership/MembershipScreenDelegate';
import { PremiumMembership } from './PremiumMembership';
import { RegularMembership } from './RegularMembership';

export interface MembershipScreenProps {
  userStore: ObservableUserStore;
  screenDelegate: MembershipScreenDelegate;
  observableScreen: ObservableMembershipScreen;
}

@observer
export class MembershipScreen extends React.Component<MembershipScreenProps> {
  public render(): React.ReactElement<any> {
    const isPremium = this.props.userStore.existingCurrentUser.isPremium;
    return (
      <ScrollView
        style={styles.screen}
        testID={MembershipScreenIds.SCREEN}
        contentContainerStyle={styles.content_container}
      >
        {isPremium === false ? (
          <RegularMembership
            showAdsDialog={this.props.screenDelegate.showAdsDialog}
          />
        ) : null}
        <PremiumMembership
          isPremium={isPremium}
          upgradeButtonState={this.props.observableScreen.upgradeButtonState}
          navigateToFeatureRequest={
            this.props.screenDelegate.navigateToFeatureRequestScreen
          }
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content_container: {
    flexGrow: 1,
  },
});
