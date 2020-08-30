/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import styled, { CSSObject } from "styled-components"
import { View } from "../common/View"
import { Theme } from "@ulangi/ulangi-common/enums"
import { config } from "../../constants/config"

export const LightBoxContainer = styled(View)({
  justifyContent: 'center',
  padding: '150px 0px',
})

export const InnerContainer = styled(View)((props): CSSObject => ({
  flexShrink: 1,
  borderRadius: '4px',
  margin: '0px 16px',
  overflow: 'hidden',
  backgroundColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryBackgroundColor
    : config.styles.dark.primaryBackgroundColor,
}))

export const TitleContainer = styled(View)((props): CSSObject => ({
  alignSelf: 'stretch',
  padding: '0px 12px',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryBackgroundColor
    : config.styles.dark.primaryBackgroundColor
}))

export const Title = styled(View)((props): CSSObject => ({
  fontWeight: 'bold',
  fontSize: '16px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryTextColor
    : config.styles.dark.primaryTextColor
}))
