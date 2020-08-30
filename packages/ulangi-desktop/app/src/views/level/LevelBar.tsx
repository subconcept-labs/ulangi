/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observer } from 'mobx-react';
import * as React from 'react';

import { config } from '../../constants/config';
import { View } from '../common/View';
import { Container } from './LevelBar.style';

export interface LevelBarProps {
  percentages: number[];
}

export const LevelBar = observer(
  (props: LevelBarProps): React.ReactElement => (
    <Container>
      {props.percentages
        .map(
          (percentage, index): React.ReactElement<any> => {
            return (
              <View
                key={index}
                style={{
                  backgroundColor: config.level.colorMap[index],
                  flexGrow: percentage,
                }}
              />
            );
          },
        )
        .reverse()}
    </Container>
  ),
);
