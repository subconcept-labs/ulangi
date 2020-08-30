/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import styled, { CSSObject } from 'styled-components';
import { Theme } from "@ulangi/ulangi-common/enums"
import { View } from "../common/View";

import { config } from '../../constants/config';

export const SelectionMenuContainer = styled(View)((props): CSSObject => ({
  flex: 'auto',
  margin: '0px 16px',
  borderRadius: '4px',
  backgroundColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryBackgroundColor
    : config.styles.dark.primaryBackgroundColor,
  overflow: 'hidden'
}))

export const TopBar = styled(View)((props): CSSObject => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: '54px',
  borderBottomWidth: 1,
  borderBottomStyle: 'solid',
  borderBottomColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryBorderColor
    : config.styles.dark.primaryBorderColor
}))
      
export const ButtonContainer = styled(View)({
  flex: 'auto',
  flexDirection: 'row',
})

export const ButtonLeftContainer = styled(ButtonContainer)({
  justifyContent: 'flex-start',
})

export const ButtonRightContainer = styled(ButtonContainer)({
  justifyContent: 'flex-end',
})

export const TitleText = styled.span((props): CSSObject => ({
  fontSize: '16px',
  fontWeight: 'bold',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryTextColor
    : config.styles.dark.primaryTextColor,
}))

export const ListContainer = styled(View)({
  flex: 'auto',
  overflow: 'auto'
})
