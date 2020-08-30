import styled, { CSSObject } from "styled-components"
import { View } from "../common/View"
import { Theme } from "@ulangi/ulangi-common/enums"
import { config } from "../../constants/config"

export const Screen = styled(View)({
  flex: 'auto',
  overflow: 'hidden'
})

export const Wrapper = styled(View)((props): CSSObject => ({
  borderRadius: '5px',
  overflow: 'hidden',
  backgroundColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryBackgroundColor
    : config.styles.dark.primaryBackgroundColor
}))

export const TitleContainer = styled(View)((): CSSObject => ({
  alignSelf: 'stretch',
  padding: '16px 0px',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
}))

export const Title = styled.span((props): CSSObject => ({
  fontWeight: 'bold',
  fontSize: '16px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryTextColor
    : config.styles.dark.primaryTextColor
}))
