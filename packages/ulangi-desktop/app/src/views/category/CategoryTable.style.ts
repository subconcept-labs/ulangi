import styled, { CSSObject } from 'styled-components';
import { config } from "../../constants/config"
import { Theme } from "@ulangi/ulangi-common/enums"

import { View } from '../common/View';

export const Table = styled(View)((props): CSSObject => ({
  overflow: 'auto',
  margin: '16px',
  borderRadius: '5px',
  boxShadow: '0px 1px 5px #00000025',
  backgroundColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryBackgroundColor
    : config.styles.dark.primaryBackgroundColor,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.secondaryBorderColor
    : config.styles.dark.secondaryBorderColor,
}));

export const SpinnerContainer = styled(View)({
  marginBottom: '16px',
});

export const LoadMoreButtonContainer = styled(View)((props): CSSObject => ({
  flexDirection: 'row',
  justifyContent: 'center',
  borderTopStyle: 'solid',
  borderTopColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.secondaryBorderColor
    : config.styles.dark.secondaryBorderColor,
  borderTopWidth: '1px',
  padding: '10px 0px'
}))
