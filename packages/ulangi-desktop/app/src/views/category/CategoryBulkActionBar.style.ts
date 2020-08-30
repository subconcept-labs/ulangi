import styled from "styled-components"
import { View } from "../common/View"
import { config } from "../../constants/config"

export const Container = styled(View)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: config.styles.primaryColor,
  border: `1px solid ${config.styles.darkPrimaryColor}`,
  padding: '10px 16px',
  margin: '0px 16px',
  borderRadius: '4px',
  boxShadow: '0 1px 3px #00000035'
})

export const SelectionText = styled.span({
  flexShrink: 1,
  fontSize: '15px',
  color: 'white',
})

export const NumberOfSelected = styled.span({
  fontWeight: 'bold',
})

export const ButtonList = styled(View)({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
})

export const ButtonContainer = styled(View)({
  paddingLeft: '12px'
})
