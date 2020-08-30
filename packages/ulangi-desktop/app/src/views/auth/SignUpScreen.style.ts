import styled from 'styled-components';

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
