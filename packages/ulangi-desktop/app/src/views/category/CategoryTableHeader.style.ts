import styled, { CSSObject } from "styled-components"
import { Theme } from "@ulangi/ulangi-common/enums"
import { config } from "../../constants/config"

export const HeaderTitle = styled.span((props): CSSObject => ({
  fontWeight: 'bold',
  fontSize: '15px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryTextColor
    : config.styles.dark.primaryTextColor
}))
