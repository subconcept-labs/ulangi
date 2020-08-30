import { Theme } from '@ulangi/ulangi-common/enums';
import styled, { CSSObject } from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const TitleContainer = styled(View)(
  (props): CSSObject => ({
    alignSelf: 'stretch',
    padding: '12px 16px',
    borderBottomWidth: '1px',
    borderBottomColor:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.primaryBorderColor
        : config.styles.dark.primaryBorderColor,
    justifyContent: 'center',
    alignItems: 'center',
  }),
);

export const TitleText = styled.span(
  (props): CSSObject => ({
    fontSize: '13px',
    fontWeight: 'bold',
    letterSpacing: -0.25,
    color:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.primaryTextColor
        : config.styles.dark.primaryTextColor,
  }),
);
