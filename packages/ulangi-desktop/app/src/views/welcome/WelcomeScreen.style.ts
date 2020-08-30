/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import styled from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const Screen = styled(View)({
  flex: 'auto',
  backgroundColor: config.styles.primaryColor,
  alignItems: 'center',
  justifyContent: 'center',
});

export const FormContainer = styled(View)({
  width: '300px',
  flex: 'auto',
});

export const LogoContainer = styled(View)({
  marginTop: '20px',
  alignItems: 'center',
});

export const TitleContainer = styled(View)({
  marginTop: '30px',
  flex: 'auto',
  justifyContent: 'center',
  alignItems: 'center',
});

export const Title = styled.span({
  textAlign: 'center',
  fontSize: '18px',
  fontWeight: 'bold',
  color: 'white',
});
