import styled, { CSSObject } from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const Button = styled.button<{ side: 'left' | 'right' }>(
  (props): CSSObject => ({
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: props.side === 'left' ? 'flex-start' : 'flex-end',
    marginLeft: '16px',
    marginRight: '16px',
  }),
);

export const ButtonTextContainer = styled(View)({
  height: '24px',
  borderRadius: '12px',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: config.styles.primaryColor,
});

export const ButtonText = styled(View)({
  padding: '0px 8px',
  textAlign: 'center',
  fontSize: 15,
  color: '#fff',
});

export const ButtonIcon = styled.img({});
