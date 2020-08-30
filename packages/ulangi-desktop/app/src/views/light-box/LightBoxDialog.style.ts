import { Theme } from '@ulangi/ulangi-common/enums';
import styled, { CSSObject } from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const DialogContainer = styled(View)(
  (props): CSSObject => ({
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: '3px',
    margin: '0px 16px',
    backgroundColor:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.primaryBackgroundColor
        : config.styles.dark.primaryBackgroundColor,
  }),
);
