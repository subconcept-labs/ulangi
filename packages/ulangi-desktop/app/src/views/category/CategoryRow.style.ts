/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import styled, { CSSObject } from 'styled-components';
import { Theme } from "@ulangi/ulangi-common/enums"
import { config } from "../../constants/config"

import { View } from '../common/View';

export const RowContainer = styled(View)((): CSSObject => ({
  flexDirection: 'row',
}));

export const CellContainer = styled(View)((props): CSSObject => ({
  borderStyle: 'solid',
  borderColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.secondaryBorderColor
    : config.styles.dark.secondaryBorderColor,
  borderWidth: '1px 1px 0px 0px',
}));

export const CheckBoxContainer = styled(CellContainer)((): CSSObject => ({
  minWidth: '43px',
  maxWidth: '43px',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'sticky',
  left: 0,
}));

export const CategoryNameContainer = styled(CellContainer)((props): CSSObject => ({
  minWidth: '150px',
  flex: 'auto',
  justifyContent: 'center',
  backgroundColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryBackgroundColor
    : config.styles.dark.primaryBackgroundColor,
  padding: '16px',
  position: 'sticky',
  left: 44
}));

export const CategoryName = styled.span((props): CSSObject => ({
  fontSize: '16px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryTextColor
    : config.styles.dark.primaryTextColor
}));

export const CountContainer = styled(CellContainer)((): CSSObject => ({
  minWidth: '45px',
  maxWidth: '45px',
  padding: '16px',
  alignItems: 'flex-end'
}));

export const Count = styled.span((props): CSSObject => ({
  fontSize: '16px',
  paddingBottom: '3px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryTextColor
    : config.styles.dark.primaryTextColor
}));

export const Terms = styled.span((props): CSSObject => ({
  fontSize: '12px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.secondaryTextColor
    : config.styles.dark.secondaryTextColor
}));

export const StatsContainer = styled(View)((): CSSObject => ({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const SpacedRepetitionProgressContainer = styled(CellContainer)((): CSSObject => ({
  padding: '16px',
  minWidth: '200px',
  maxWidth: '200px',
}))

export const WritingProgressContainer = styled(CellContainer)((): CSSObject => ({
  padding: '16px',
  minWidth: '200px',
  maxWidth: '200px',
}))

export const ProgressContainer = styled.a`
  display: flex;
  flex-direction: column;
  flex: auto;
`

export const ProgressText = styled.span((props): CSSObject => ({
  fontSize: '14px',
  //fontWeight: 'bold',
  paddingBottom: '5px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.secondaryTextColor
    : config.styles.dark.secondaryTextColor
}));

export const ActionButtonContainer = styled(CellContainer)((): CSSObject => ({
  padding: '16px',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '45px',
  maxWidth: '45px',
  borderRightWidth: '0px',
}));

export const ActionButton = styled.button({});

export const DueAndNewCountContainer = styled.button({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginLeft: '2px',
  minWidth: '80px',
});

export const NotApplicable = styled.span((props): CSSObject => ({
  fontWeight: 'bold',
  fontSize: '14px',
  paddingRight: '2px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.secondaryTextColor
    : config.styles.dark.secondaryTextColor
}));

export const RightCaret = styled.img({
  marginLeft: '5px',
  opacity: 0.7,
});
