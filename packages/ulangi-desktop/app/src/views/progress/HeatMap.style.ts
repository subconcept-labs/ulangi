import { Theme } from '@ulangi/ulangi-common/enums';
import styled, { CSSObject } from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const Wrapper = styled(View)({});

export const ItemList = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
});

export const Item = styled(View)({
  height: '24px',
  width: '24px',
  borderRadius: '2px',
  margin: '2px',
});

export const MonthList = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

export const MonthContainer = styled(View)({
  marginBottom: '10px',
  maxWidth: '280px',
  padding: '0px 6px',
});

export const Month = styled.span(
  (props): CSSObject => ({
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '4px 2px',
    color:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.secondaryTextColor
        : config.styles.dark.secondaryTextColor,
  }),
);

export const TooltipContainer = styled(View)({
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px',
});

export const TooltipTitle = styled.span({
  fontSize: '15px',
  fontWeight: 'bold',
  color: '#f7f7f7',
});

export const TooltipTextContainer = styled(View)({
  padding: '3px',
});

export const TooltipText = styled.span({
  fontSize: '14px',
  color: '#f7f7f7',
  fontWeight: 'bold',
});
