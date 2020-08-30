import { Theme } from '@ulangi/ulangi-common/enums';
import styled, { CSSObject } from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const TopBarContainer = styled(View)(
  (props): CSSObject => ({
    alignSelf: 'stretch',
    height: '60px',
    borderBottomWidth: '1px',
    borderBottomColor:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.primaryBorderColor
        : config.styles.dark.primaryBorderColor,
    borderBottomStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }),
);

export const ButtonContainer = styled(View)({
  minWidth: '80px',
  justifyContent: 'center',
  alignSelf: 'stretch',
});

export const LeftButtonContainer = styled(ButtonContainer)({
  alignItems: 'flex-start',
  marginLeft: '16px',
});

export const RightButtonContainer = styled(ButtonContainer)({
  alignItems: 'flex-end',
  marginRight: '16px',
});

export const TitleContainer = styled(View)({
  flex: 'auto',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 1,
});

export const Title = styled.span(
  (props): CSSObject => ({
    fontSize: '17px',
    fontWeight: 'bold',
    padding: '0px 6px',
    color:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.primaryTextColor
        : config.styles.dark.primaryTextColor,
  }),
);
