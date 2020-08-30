import styled from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const Form = styled(View)({});

export const TextContainer = styled(View)({
  padding: '0px 16px',
});

export const Text = styled(View)({
  color: '#999',
});

export const BottomContainer = styled(View)({
  flexDirection: 'row',
  justifyContent: 'center',
  margin: '16px 16px 0px',
});

export const Touchable = styled.a({});

export const TouchableText = styled.span({
  fontSize: '15px',
  color: config.styles.lightPrimaryColor,
});
