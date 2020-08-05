/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreenLayout,
  ObservableTime,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import { AtomTimeStyles, atomTimeResponsiveStyles } from './AtomTime.style';

export interface AtomTimeProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  observableTime: ObservableTime;
}

@observer
export class AtomTime extends React.Component<AtomTimeProps> {
  private get styles(): AtomTimeStyles {
    return atomTimeResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <DefaultText style={this.styles.time_text}>
          {moment(this.props.observableTime.remainingTime).format('m:ss')}
        </DefaultText>
      </View>
    );
  }
}
