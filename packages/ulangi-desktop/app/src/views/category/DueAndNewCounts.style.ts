import styled, { CSSObject } from 'styled-components';
import { Theme } from "@ulangi/ulangi-common/enums"
import { config } from "../../constants/config"

import { View } from '../common/View';

export const CountContainer = styled(View)({
  flexShrink: 1,
});

export const Count = styled.span((props): CSSObject => ({
  textAlign: 'right',
  fontSize: '14px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.secondaryTextColor
    : config.styles.dark.secondaryTextColor
}));
