import styled from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const Form = styled(View)({});

export const BottomContainer = styled(View)({
  flexDirection: 'row',
  justifyContent: 'center',
  marginHorizontal: '16px',
  marginTop: '16px',
});

export const Touchable = styled.a({});

export const TouchableText = styled.span({
  fontSize: '15px',
  color: config.styles.lightPrimaryColor,
});
