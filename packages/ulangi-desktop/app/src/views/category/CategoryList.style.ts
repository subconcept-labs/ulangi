import styled from 'styled-components';

import { View } from '../common/View';

export const List = styled.div({
  paddingTop: '16px',
  paddingBottom: '74px',
  overflow: 'auto'
});

export const SpinnerContainer = styled(View)({
  marginBottom: '16px',
});

export const LoadMoreButtonContainer = styled(View)({
  marginTop: '10px',
  flexDirection: 'row',
  justifyContent: 'center'
})
