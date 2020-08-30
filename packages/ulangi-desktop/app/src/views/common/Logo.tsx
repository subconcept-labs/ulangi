/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observer } from 'mobx-react';
import * as React from 'react';

import { Images } from '../../constants/Images';
import { Image } from './Logo.style';

export const Logo = observer(
  (): React.ReactElement => <Image src={Images.LOGO_60X60} />,
);
