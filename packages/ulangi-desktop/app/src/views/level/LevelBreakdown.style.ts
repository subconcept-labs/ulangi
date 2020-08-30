import styled, { CSSObject } from "styled-components"
import { config } from "../../constants/config"
import { View } from "../common/View"
import { Theme } from "@ulangi/ulangi-common/enums"

export const ChartContainer = styled(View)((): CSSObject => ({
}))

export const RowContainer = styled(View)((props): CSSObject => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryBorderColor
    : config.styles.dark.primaryBorderColor,
  padding: '14px 16px',
}))

export const Level = styled.span((props): CSSObject => ({
  paddingRight: '4px',
  width: '72px',
  fontSize: '14px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryTextColor
    : config.styles.dark.primaryTextColor
}))

export const CountContainer = styled(View)({
  width: '50px',
  paddingLeft: '4px'
})

export const Count = styled.span((props): CSSObject => ({
  textAlign: 'right',
  fontWeight: 'bold',
  fontSize: '14px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryTextColor
    : config.styles.dark.primaryTextColor
}))

export const Percentage = styled.span((props): CSSObject => ({
  textAlign: 'right',
  fontWeight: 'bold',
  fontSize: '14px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.secondaryTextColor
    : config.styles.dark.secondaryTextColor
}))
