/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { toJS } from 'mobx';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { DefaultButton, DefaultButtonProps } from '../common/DefaultButton';

export interface LightBoxButtonListProps {
  buttonList: readonly DefaultButtonProps[];
}

export class LightBoxButtonList extends React.Component<
  LightBoxButtonListProps
> {
  public render(): null | React.ReactElement<any> {
    if (this.props.buttonList.length === 0) {
      return null;
    } else {
      return (
        <View style={styles.button_list_container}>
          {this.props.buttonList.map(
            (button, index): React.ReactElement<any> => {
              return (
                <View
                  key={button.testID || index}
                  style={styles.button_container}>
                  <DefaultButton {...button} styles={toJS(button.styles)} />
                </View>
              );
            },
          )}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  button_list_container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 12,
  },

  button_container: {
    paddingHorizontal: 8,
  },
});
