import styled from 'styled-components';

import { DefaultButton } from '../common/DefaultButton';
import { View } from '../common/View';

export const Wrapper = styled(View)({
  alignItems: 'center',
  marginTop: '30px',
  padding: '10px 20px 0px',
});

export const HeatMapContainer = styled(View)({
  padding: '16px 0px',
});

export const ViewHeatMapButtonContainer = styled(View)({
  marginTop: '14px',
  flexDirection: 'row',
  justifyContent: 'center',
});

export const ViewHeatMapButton = styled(DefaultButton)({
  height: '40px',
  padding: '0px 18px',
});
