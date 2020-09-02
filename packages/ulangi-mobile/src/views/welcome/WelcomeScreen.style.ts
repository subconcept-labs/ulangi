/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { CSSObject } from "styled-components"
import styled from 'styled-components/native';
import { Responsive } from "../../context/ResponsiveContext"

export const LogoContainer = styled.View((props: Responsive): CSSObject => ({
  marginTop: props.scaleByFactor(20),
}))

export const TitleContainer = styled.View((props: Responsive): CSSObject => ({
  marginTop: props.scaleByFactor(30),
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}))

export const Title = styled.Text((props: Responsive): CSSObject => ({
  textAlign: 'center',
  fontSize: props.scaleByFactor(18),
  fontWeight: 'bold',
  color: 'white',
}))
