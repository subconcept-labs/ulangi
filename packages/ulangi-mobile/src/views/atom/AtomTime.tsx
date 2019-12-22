/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableTime } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';

export interface AtomTimeProps {
  observableTime: ObservableTime;
}

@observer
export class AtomTime extends React.Component<AtomTimeProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <DefaultText style={styles.time_text}>
          {moment(this.props.observableTime.remainingTime).format('m:ss')}
        </DefaultText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  time_text: {
    color: config.atom.textColor,
    fontSize: 34,
    fontFamily: 'JosefinSans-Bold',
  },
});
