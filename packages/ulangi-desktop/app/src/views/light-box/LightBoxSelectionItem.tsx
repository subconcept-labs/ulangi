/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Images } from '../../constants/Images';
import { SelectIcon, ItemIcon, Text, ItemContainer, ItemTouchable } from "./LightBoxSelectionItem.style"

export interface LightBoxSelectionItemProps {
  item: SelectionItem;
  isSelected: boolean;
  isLast: boolean;
}

export const LightBoxSelectionItem = observer((props: LightBoxSelectionItemProps): React.ReactElement => {
  return (
    <ItemContainer style={props.isLast ? { borderBottomWidth: 0 } : {}}>
      <ItemTouchable onClick={props.item.onPress}>
        {props.isSelected === true ? (
          <SelectIcon src={Images.CIRCLE_CHECKED_PRIMARY_24X24} />
        ) : (
          <SelectIcon src={Images.CIRCLE_UNCHECKED_GREY_24X24} />
        )}
        {typeof props.item.icon !== 'undefined' ? (
          <ItemIcon src={props.item.icon} />
        ) : null}
        <Text
          style={props.item.textColor ? { color: props.item.textColor } : {}}>
          {props.item.text}
        </Text>
      </ItemTouchable>
    </ItemContainer>
  );
})
