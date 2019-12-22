/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { TouchableOpacity, TouchableOpacityProperties } from 'react-native';

// This component is a fix to TouchableWithoutFeedback since it consumes TestID
export class FixedTouchableWithoutFeedback extends React.Component<
  TouchableOpacityProperties
> {
  public render(): React.ReactElement<any> {
    return (
      // Set accessible to false so it does not consume testID of children components
      <TouchableOpacity activeOpacity={1} accessible={false} {...this.props}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
