/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { DefaultText } from '../common/DefaultText';

export interface MembershipTagProps {
  text: string;
  textColor: string;
}

@observer
export class MembershipTag extends React.Component<MembershipTagProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.tag_container}>
        <DefaultText
          allowFontScaling={false}
          style={[styles.tag_text, { color: this.props.textColor }]}>
          {this.props.text}
        </DefaultText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tag_container: {
    alignSelf: 'center',
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 12,
    height: 26,
    borderColor: '#F7F7F7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 0.5,
    shadowOpacity: 0.1,
    elevation: 0.75,
  },

  tag_text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#30C692',
  },
});
