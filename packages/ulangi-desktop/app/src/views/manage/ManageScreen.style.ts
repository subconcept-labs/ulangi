import { Theme } from '@ulangi/ulangi-common/enums';
import styled, { CSSObject } from 'styled-components';

import { config } from '../../constants/config';
import { View } from '../common/View';

export const Screen = styled(View)(
  (props): CSSObject => ({
    flex: 'auto',
    overflow: 'hidden',
    backgroundColor:
      props.theme.name === Theme.LIGHT
        ? config.styles.light.secondaryBackgroundColor
        : config.styles.dark.secondaryBackgroundColor,
  }),
);

export const EmptyContainer = styled(View)({
  padding: '16px',
  flex: 'auto',
  justifyContent: 'center',
  alignItems: 'center'
});

export const EmptyText = styled.span((props): CSSObject => ({
  fontSize: '15px',
  color: props.theme.name === Theme.LIGHT
    ? config.styles.light.primaryTextColor
    : config.styles.dark.secondaryTextColor,
}));

export const BulkActionBarContainer = styled(View)({
})
