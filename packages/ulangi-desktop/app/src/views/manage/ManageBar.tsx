import styled, { CSSObject } from 'styled-components';

import { View } from '../common/View';

export const ManageBar = styled(View)((): CSSObject => ({
  padding: '16px',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));
