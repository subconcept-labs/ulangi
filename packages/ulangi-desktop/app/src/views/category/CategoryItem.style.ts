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

export const ItemContainer = styled(View)((props): CSSObject => ({
  margin: '16px',
  width: '100%',
  maxWidth: '500px',
  borderRadius: '5px',
  boxShadow: '0px 2px 5px #00000025',
  backgroundColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryBackgroundColor
    : config.styles.dark.primaryBackgroundColor
}));

export const TopContainer = styled(View)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px',
});

export const BottomContainer = styled(View)({});

export const HashTag = styled.span({
  color: config.styles.primaryColor,
  fontWeight: 'bold',
  paddingRight: '2px',
})

export const StatsContainer = styled(View)((props): CSSObject => ({
  padding: '16px 0px',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: props.theme.name === Theme.LIGHT
    ? config.styles.light.secondaryBorderColor
    : config.styles.dark.secondaryBorderColor,
}));

export const ProgressContainer = styled.a({
  display: 'flex',
  flexDirection: 'column',
  flex: 'auto',
  paddingLeft: '14px'
});

export const ProgressText = styled.span((props): CSSObject => ({
  fontSize: '14px',
  //fontWeight: 'bold',
  paddingBottom: '5px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.secondaryTextColor
    : config.styles.dark.secondaryTextColor
}));

export const CategoryName = styled.span((props): CSSObject => ({
  fontWeight: 'bold',
  fontSize: '16px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryTextColor
    : config.styles.dark.primaryTextColor
}));

export const CategoryMeta = styled.span((props): CSSObject => ({
  fontSize: '12px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.secondaryTextColor
    : config.styles.dark.secondaryTextColor,
}));

export const LeftContainer = styled(View)({
  paddingRight: '12px',
  flexShrink: 1,
});

export const RightContainer = styled(View)({
  flexDirection: 'row',
  paddingLeft: '12px',
  alignItems: 'center',
  justifyContent: 'center',
});

export const RightItem = styled(View)({
  paddingLeft: '12px',
});

export const FirstRightItem = styled(RightItem)({
  paddingLeft: '0px',
});

export const Count = styled.a((props): CSSObject => ({
  fontWeight: 'bold',
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

export const ReviewButton = styled.button({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginLeft: '12px',
  width: '100px',
  paddingRight: '10px',
});

export const NotApplicable = styled.span((props) => ({
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
