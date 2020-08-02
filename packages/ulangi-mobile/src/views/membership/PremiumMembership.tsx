/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableUpgradeButtonState } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { config } from '../../constants/config';
import { ls, ss } from '../../utils/responsive';
import { DefaultText } from '../common/DefaultText';
import { MembershipLabel } from './MembershipLabel';
import { MembershipTitle } from './MembershipTitle';
import { PremiumFeatureList } from './PremiumFeatureList';
import { UpgradeButton } from './UpgradeButton';

export interface PremiumMembershipProps {
  isPremium: boolean;
  upgradeButtonState: ObservableUpgradeButtonState;
  navigateToFeatureRequest: () => void;
}

@observer
export class PremiumMembership extends React.Component<PremiumMembershipProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <View style={styles.title_container}>
          <MembershipLabel
            label={
              this.props.isPremium === true
                ? 'CURRENT ACCOUNT TYPE'
                : 'UPGRADE TO'
            }
          />
          <MembershipTitle title="PREMIUM" />
        </View>
        <View style={styles.feature_list_container}>
          <PremiumFeatureList />
        </View>
        {this.props.isPremium === true ? (
          <>
            <View style={styles.thank_you_container}>
              <DefaultText style={styles.note}>
                Thank you for using our app.
              </DefaultText>
            </View>
            <TouchableOpacity
              style={styles.feature_request_btn}
              onPress={this.props.navigateToFeatureRequest}
              hitSlop={{ top: 10, bottom: 10 }}>
              <DefaultText style={styles.highlighted}>
                Have a feature request?
              </DefaultText>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.button_container}>
              <UpgradeButton
                upgradeButtonState={this.props.upgradeButtonState}
              />
            </View>
            <View style={styles.note_container}>
              <DefaultText style={styles.note}>
                This upgrade will apply to the current Ulangi account.
              </DefaultText>
            </View>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: ss(50),
    flex: 1,
    backgroundColor: config.styles.premiumMembershipColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title_container: {},

  feature_list_container: {
    alignSelf: 'stretch',
    paddingTop: ss(40),
  },

  button_container: {
    alignSelf: 'stretch',
    paddingTop: ss(20),
  },

  loading_text: {
    textAlign: 'center',
    paddingTop: ss(4),
    fontSize: ss(14),
    fontWeight: '700',
    color: 'white',
  },

  note_container: {
    paddingTop: ss(16),
    paddingHorizontal: ls(16),
  },

  thank_you_container: {
    paddingTop: ss(40),
    paddingHorizontal: ls(16),
  },

  note: {
    textAlign: 'center',
    fontSize: ss(14),
    color: '#ffffff98',
  },

  feature_request_btn: {
    paddingTop: ss(2),
    paddingHorizontal: ls(16),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  highlighted: {
    textAlign: 'center',
    fontSize: ss(14),
    color: '#fff',
  },
});
