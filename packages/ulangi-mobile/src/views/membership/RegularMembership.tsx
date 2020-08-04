/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';
import { MembershipLabel } from './MembershipLabel';
import { MembershipTitle } from './MembershipTitle';
import { RegularFeatureList } from './RegularFeatureList';

export interface RegularMembershipProps {
  showAdsDialog: () => void;
}

@observer
export class RegularMembership extends React.Component<RegularMembershipProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <View style={styles.title_container}>
          <MembershipLabel label="CURRENT ACCOUNT TYPE" />
          <MembershipTitle title="FREE" />
        </View>
        <View style={styles.feature_list_container}>
          <RegularFeatureList showAdsDialog={this.props.showAdsDialog} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: ss(50),
    backgroundColor: config.styles.regularMembershipColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title_container: {},

  feature_list_container: {
    alignSelf: 'stretch',
    paddingTop: ss(40),
  },
});
