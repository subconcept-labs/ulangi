/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableReflexGameStats } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ss } from '../../utils/responsive';
import { DefaultText } from '../common/DefaultText';

export interface ReflexGameStatsProps {
  gameStats: ObservableReflexGameStats;
}

@observer
export class ReflexGameStats extends React.Component<ReflexGameStatsProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <DefaultText style={styles.score_text}>
          {this.props.gameStats.score}
        </DefaultText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ss(16),
    flex: 1,
  },

  score_text: {
    fontFamily: 'Raleway-Black',
    fontSize: ss(32),
    color: 'white',
  },
});
