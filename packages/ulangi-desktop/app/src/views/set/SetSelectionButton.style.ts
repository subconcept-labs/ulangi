import styled from 'styled-components';

import { DefaultButton } from '../common/DefaultButton';

export const Button = styled(DefaultButton)`
  height: 38px;
  padding: 0px 14px;
`;

export const ButtonText = styled.span({
  fontSize: '15px',
  padding: '0px 14px 0px 10px',
  flexShrink: 1,
  color: '#545454',
});

export const ButtonIcon = styled.img({});

export const ButtonCaret = styled.img({
  marginRight: '4px',
});
