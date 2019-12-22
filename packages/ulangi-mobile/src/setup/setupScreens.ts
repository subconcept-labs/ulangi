/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Constructor } from '@ulangi/extended-types';
import { Navigation } from '@ulangi/react-native-navigation';
import * as _ from 'lodash';

import { Provider } from '../Provider';
import { ScreenContainers } from '../constants/ScreenContainers';
import { extendContainer } from '../decorators/extendContainer';

export function setupScreens(): void {
  _.forOwn(
    ScreenContainers,
    (container, screenName): void => {
      Navigation.registerComponentWithRedux(
        screenName,
        (): Constructor<React.Component> => extendContainer(container),
        Provider,
        null
      );
    }
  );
}
