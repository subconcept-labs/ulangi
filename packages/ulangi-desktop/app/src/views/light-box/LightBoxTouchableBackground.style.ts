import styled from 'styled-components';

import { View } from '../common/View';

export const LightBoxContainer = styled(View)({
  justifyContent: 'center',
  alignItems: 'center',
  flex: 'auto',
  overflow: 'hidden'
});

export const TouchableBackground = styled.a({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#00000075',
});
