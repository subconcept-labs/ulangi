/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState } from '@ulangi/ulangi-common/enums';
import { IObservableValue } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, ActivityIndicatorProperties } from 'react-native';

export type DefaultActivityIndicatorProps = {
  activityState: IObservableValue<ActivityState>;
  isRefreshing?: IObservableValue<boolean>;
} & ActivityIndicatorProperties;

@observer
export class DefaultActivityIndicator extends React.Component<
  DefaultActivityIndicatorProps
> {
  public render(): null | React.ReactElement<any> {
    if (
      this.props.activityState.get() === ActivityState.ACTIVE &&
      // Do not render if refreshing
      // since refresh has it own activity indicator
      (typeof this.props.isRefreshing === 'undefined' ||
        this.props.isRefreshing.get() === false)
    ) {
      return <ActivityIndicator {...this.props} />;
    } else {
      return null;
    }
  }
}
