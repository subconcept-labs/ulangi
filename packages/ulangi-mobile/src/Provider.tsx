/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { observer } from 'mobx-react';
import * as React from 'react';

import { ContainerProps } from './Container';
import { ServiceRegistry } from './ServiceRegistry';

@observer
export class Provider extends React.Component {
  public render(): React.ReactElement<any> {
    const child = assertExists(
      React.Children.only(this.props.children),
      'Provider requires one child',
    );

    if (React.isValidElement<any>(child)) {
      const containerProps: ContainerProps<any> = {
        componentId: child.props.componentId,
        screenType: child.props.screenType,
        theme: child.props.theme,
        styles: child.props.styles,
        passedProps: child.props.passedProps,
        ...ServiceRegistry.services,
      };

      return React.cloneElement(child, containerProps);
    } else {
      throw new Error('Provider must have a valid child element.');
    }
  }
}
