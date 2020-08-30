import { Theme } from '@ulangi/ulangi-common/enums';
import styled, { CSSObject } from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const Screen = styled(View)({
  flex: 'auto',
  overflow: 'hidden',
  backgroundColor: config.styles.light.secondaryBackgroundColor,
});

export const Wrapper = styled(View)({
  maxWidth: '600px',
  alignSelf: 'center'
});

export const Title = styled.span(
  (props): CSSObject => ({
    fontSize: '17px',
    textAlign: 'center',
    fontWeight: 'bold',
    color:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.primaryTextColor
        : config.styles.dark.primaryTextColor,
  }),
);

export const Subtitle = styled.span(
  (props): CSSObject => ({
    paddingTop: '4px',
    fontSize: '16px',
    textAlign: 'center',
    color:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.secondaryTextColor
        : config.styles.dark.secondaryTextColor,
  }),
);

export const Note = styled.span(
  (props): CSSObject => ({
    fontSize: '14px',
    color:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.secondaryTextColor
        : config.styles.dark.secondaryTextColor,
  }),
);

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

export const TouchableText = styled.a({
  color: config.styles.primaryColor,
});

export const SpinnerContainer = styled(View)({
  marginTop: '10px',
});
