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

import { DefaultText } from '../common/DefaultText';

export interface UpgradeButtonProps {
  upgradeButtonState: ObservableUpgradeButtonState;
}

@observer
export class UpgradeButton extends React.Component<UpgradeButtonProps> {
  public render(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        onPress={this.props.upgradeButtonState.onPress}
        style={styles.button_container}
        disabled={typeof this.props.upgradeButtonState.onPress === 'undefined'}
      >
        <View style={styles.text_container}>
          <DefaultText style={styles.text}>
            {this.props.upgradeButtonState.text}
          </DefaultText>
        </View>
        {typeof this.props.upgradeButtonState.price !== 'undefined' ? (
          <View style={styles.price_container}>
            <DefaultText style={styles.price}>
              {this.props.upgradeButtonState.price}
            </DefaultText>
            {typeof this.props.upgradeButtonState.currency !== 'undefined' ? (
              <DefaultText style={styles.currency}>
                {this.props.upgradeButtonState.currency}
              </DefaultText>
            ) : null}
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5C6BC0',
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    elevation: 1,
  },

  text_container: {
    paddingRight: 14,
    flexShrink: 1,
  },

  text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  price_container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#f9f9f9',
    paddingLeft: 14,
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  currency: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
});
