import { Theme } from '@ulangi/ulangi-common/enums';
import styled, { CSSObject } from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const Screen = styled(View)(
  (props): CSSObject => ({
    flex: 'auto',
    backgroundColor:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.secondaryBackgroundColor
        : config.styles.dark.secondaryBackgroundColor,
  }),
);
