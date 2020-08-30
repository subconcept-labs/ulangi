import { Theme } from '@ulangi/ulangi-common/enums';
import styled, { CSSObject } from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const MessageContainer = styled(View)(
  (): CSSObject => ({
    alignSelf: 'stretch',
    padding: '11px 16px',
  }),
);

export const Message = styled.span(
  (props): CSSObject => ({
    lineHeight: '19px',
    fontSize: '15px',
    color:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.primaryTextColor
        : config.styles.dark.primaryTextColor,
  }),
);
