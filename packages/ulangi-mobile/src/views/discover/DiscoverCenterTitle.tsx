/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSetStore } from '@ulangi/ulangi-observable';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';

export interface DiscoverCenterTitleProps {
  setStore: ObservableSetStore;
  publicSetCount: IObservableValue<null | number>;
  search: (term: string) => void;
}

@observer
export class DiscoverCenterTitle extends React.Component<
  DiscoverCenterTitleProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <DefaultText style={styles.title}>
          You can search dictionary for words or categories, such as
          <DefaultText
            style={styles.highlighted}
            onPress={(): void => this.props.search('cat')}>
            {' '}
            cat
          </DefaultText>{' '}
          or
          <DefaultText
            style={styles.highlighted}
            onPress={(): void => this.props.search('animals')}>
            {' '}
            animals
          </DefaultText>
          .
        </DefaultText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
  },

  highlighted: {
    color: config.styles.primaryColor,
    fontSize: 16,
    fontWeight: '700',
  },

  search_button: {
    marginTop: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0.75,
    shadowOpacity: 0.15,
    elevation: 0.75,
  },
});
