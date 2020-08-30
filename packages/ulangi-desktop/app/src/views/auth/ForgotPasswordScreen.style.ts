import { Theme } from '@ulangi/ulangi-common/enums';
import styled, { CSSObject } from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const Screen = styled(View)({
  flex: 'auto',
  alignItems: 'center',
  backgroundColor: config.styles.primaryColor,
});

export const Wrapper = styled(View)({
  flex: 'auto',
  width: '300px',
});

export const LogoContainer = styled(View)({
  marginTop: '20px',
  alignItems: 'center',
});

export const FormContainer = styled(View)({
  marginTop: '20px',
  flex: 'auto',
});

export const Title = styled.span(
  (props): CSSObject => ({
    fontSize: '15px',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: -0.5,
    color:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.primaryTextColor
        : config.styles.dark.primaryTextColor,
  }),
);

export const Subtitle = styled.span(
  (props): CSSObject => ({
    fontSize: '14px',
    textAlign: 'center',
    color:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.secondaryTextColor
        : config.styles.dark.secondaryTextColor,
  }),
);

export const Note = styled.span(
  (props): CSSObject => ({
    fontSize: '13px',
    color:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.secondaryTextColor
        : config.styles.dark.secondaryTextColor,
  }),
);

export const ErrorMessage = styled.span(
  (props): CSSObject => ({
    paddingVertical: '16px',
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
