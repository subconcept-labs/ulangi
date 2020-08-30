/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import styled, { CSSObject } from "styled-components"
import { Theme } from "@ulangi/ulangi-common/enums"
import { View } from "../common/View"

import { config } from '../../constants/config';

export const ItemContainer = styled(View)((props): CSSObject => ({
  margin: '0px 8px',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.secondaryBorderColor
    : config.styles.dark.secondaryBorderColor
}))

export const ItemTouchable = styled.a({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '13px 8px',
})

export const SelectIcon = styled.img({
  marginRight: '10px'
})

export const ItemIcon = styled.img({
  marginRight: '6px'
})

export const Text = styled.span((props): CSSObject => ({
  flexShrink: 1,
  fontSize: '15px',
  color: props.theme.name
    ? config.styles.light.primaryTextColor
    : config.styles.dark.primaryTextColor
}))
