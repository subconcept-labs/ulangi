import styled, { CSSObject } from "styled-components"
import { View } from "../common/View"

export const Container = styled(View)((): CSSObject => ({
  flex: 'auto',
  flexDirection: 'row',
  overflow: 'hidden',
}))

export const Part = styled(View)((): CSSObject => ({
  height: '8px',
  borderRadius: '4px'
}))
