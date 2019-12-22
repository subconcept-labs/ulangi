/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Constructor } from '@ulangi/extended-types';

import { Container } from '../Container';

export type ExtractPassedProps<Type> = Type extends Constructor<
  Container<infer X>
>
  ? X
  : {};
