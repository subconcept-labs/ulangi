import styled from 'styled-components';

import { config } from '../../constants/config';
import { DefaultButton } from './DefaultButton';

export const PrimaryButton = styled(DefaultButton)`
  background-color: ${config.styles.primaryColor};
  border-color: ${config.styles.darkPrimaryColor};
  color: #fff;
  box-shadow: 0px 2px 3px #00000030;
  :hover {
    background-color: ${config.styles.darkPrimaryColor};
  }

  :active {
    background-color: ${config.styles.lightPrimaryColor};
    box-shadow: 0px 1px 3px #00000000;
  }
`;
