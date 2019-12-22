/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';

export interface MembershipLabelProps {
  label: string;
}

export class MembershipLabel extends React.Component<MembershipLabelProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.label_container}>
        <DefaultText style={styles.label}>{this.props.label}</DefaultText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label_container: {
    alignSelf: 'center',
  },

  label: {
    paddingVertical: 4,
    color: 'black',
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.3,
  },
});
