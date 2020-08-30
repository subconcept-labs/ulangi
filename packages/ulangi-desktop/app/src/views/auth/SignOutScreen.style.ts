import styled from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const Screen = styled(View)({
  flex: 'auto',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: config.styles.primaryColor,
});
