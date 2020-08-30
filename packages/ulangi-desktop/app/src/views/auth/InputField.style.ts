import styled from 'styled-components';

import { View } from '../common/View';

export const InputContainer = styled(View)``;

export const Input = styled.input`
  border: 0px;
  border-radius: 4px;
  margin: 5px 0px;
  padding: 16px 14px;
  background-color: #eee;
  color: #545454;
  font-size: 15px;

  ::placeholder {
    color: #999;
  }
`;
