/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import styled from 'styled-components';

export const Button = styled.button`
  justify-content: center;
  align-iems: center;
  align-self: stretch;
  padding: 14px 12px;
  border-radius: 4px;
  background-color: #00c7fe;
  box-shadow: 'rgba(0, 0, 0, 0.15) 0px 3px';
`;

export const ButtonText = styled.span({
  color: 'white',
  fontSize: '17px',
  fontFamily: 'Arial',
  fontWeight: 'bold',
  textAlign: 'center',
});
