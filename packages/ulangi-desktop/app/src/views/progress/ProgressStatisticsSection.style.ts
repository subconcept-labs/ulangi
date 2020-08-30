import { Theme } from '@ulangi/ulangi-common/enums';
import styled, { CSSObject } from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const StatisticsContainer = styled(View)(
  (props): CSSObject => ({
    alignItems: 'center',
    margin: '30px 16px 0px',
    padding: '20px 0px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.secondaryBorderColor
        : config.styles.dark.secondaryBorderColor,
  }),
);

export const StatisticsList = styled(View)({
  marginTop: '10px',
});

export const StatisticsRow = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
});

export const StatisticsItem = styled(View)({
  flex: 'auto',
  padding: '12px 20px',
});

export const Count = styled.span(
  (props): CSSObject => ({
    paddingTop: '5px',
    fontSize: '38px',
    textAlign: 'center',
    fontWeight: 'bold',
    color: props.theme.name === Theme.LIGHT ? '#545454' : '#aaa',
  }),
);
