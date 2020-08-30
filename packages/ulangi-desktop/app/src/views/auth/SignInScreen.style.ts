import styled from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const Screen = styled(View)({
  flex: 'auto',
  alignItems: 'center',
  backgroundColor: config.styles.primaryColor,
});

export const Wrapper = styled(View)({
  width: '300px',
  flex: 'auto',
});

export const LogoContainer = styled(View)({
  marginTop: '20px',
  alignItems: 'center',
});

export const FormContainer = styled(View)({
  flex: 'auto',
  marginTop: '20px',
});

export const SignInAsGuestContainer = styled(View)({
  marginBottom: '30px',
});

export const SignInAsGuestNote = styled.span({
  paddingHorizontal: '16px',
  paddingTop: '10px',
  textAlign: 'center',
  fontSize: '15px',
  color: config.styles.lightPrimaryColor,
});
