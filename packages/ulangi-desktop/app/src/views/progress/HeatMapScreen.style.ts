import { Theme } from '@ulangi/ulangi-common/enums';
import styled, { CSSObject } from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const Screen = styled(View)(
  (props): CSSObject => ({
    flex: 'auto',
    overflow: 'hidden',
    backgroundColor:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.secondaryBackgroundColor
        : config.styles.dark.secondaryBackgroundColor,
  }),
);

export const OptionBarContainer = styled(View)({
  padding: '14px 16px',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const Year = styled.span(
  (props): CSSObject => ({
    fontSize: '32px',
    padding: '30px 0px',
    textAlign: 'center',
    fontWeight: 'bold',
    color:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.primaryTextColor
        : config.styles.dark.primaryTextColor,
  }),
);

export const HeatMapContainer = styled(View)({
  padding: '20px 16px',
  alignItems: 'center',
  alignSelf: 'center',
  maxWidth: '600px',
});

export const ErrorMessage = styled.span(
  (props): CSSObject => ({
    padding: '16px 0px',
    fontSize: '14px',
    textAlign: 'center',
    color:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.secondaryTextColor
        : config.styles.dark.secondaryTextColor,
  }),
);

export const TouchableText = styled.span({
  color: config.styles.primaryColor,
});

export const SpinnerContainer = styled(View)({});
