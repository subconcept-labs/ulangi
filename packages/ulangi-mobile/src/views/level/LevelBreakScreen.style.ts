/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import {
  darkStyles as defaultLightBoxContainerWithTitleDarkStyles,
  lightStyles as defaultLightBoxContainerWithTitleLightStyles,
} from '../light-box/LightBoxContainerWithTitle.style';

export const lightBoxContainerWithTitleLightStyles = _.merge(
  {},
  defaultLightBoxContainerWithTitleLightStyles,
  {
    light_box_container: {
      paddingVertical: 120,
    },
  },
);

export const lightBoxContainerWithTitleDarkStyles = _.merge(
  {},
  defaultLightBoxContainerWithTitleDarkStyles,
  {
    light_box_container: {
      paddingVertical: 120,
    },
  },
);
