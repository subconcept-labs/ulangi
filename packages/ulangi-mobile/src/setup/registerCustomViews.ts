/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Constructor } from '@ulangi/extended-types';
import { Navigation } from '@ulangi/react-native-navigation';
import * as _ from 'lodash';
import * as React from 'react';

import { Provider } from '../Provider';
import { CustomViews } from '../constants/CustomViews';

export function registerCustomViews(): void {
  _.forOwn(
    CustomViews,
    (component, name): void => {
      Navigation.registerComponentWithRedux(
        name,
        (): Constructor<React.Component> => component,
        Provider,
        null,
      );
    },
  );
}
