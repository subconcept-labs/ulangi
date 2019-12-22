/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { DefaultText } from '../common/DefaultText';

export interface MembershipTitleProps {
  title: 'PREMIUM' | 'FREE';
}

@observer
export class MembershipTitle extends React.Component<MembershipTitleProps> {
  public render(): null | React.ReactElement<any> {
    return (
      <DefaultText allowFontScaling={false} style={styles.title}>
        {this.props.title}
      </DefaultText>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Raleway-Black',
    fontSize: 38,
    color: 'white',
    textAlign: 'center',
  },
});
