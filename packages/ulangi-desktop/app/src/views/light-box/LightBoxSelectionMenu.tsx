/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SelectionMenu } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Button } from '../common/Button';
import { LightBoxSelectionItem } from './LightBoxSelectionItem';
import { SelectionMenuContainer, TopBar, ButtonLeftContainer, ButtonRightContainer, TitleText, ListContainer } from "./LightBoxSelectionMenu.style"
import { ScrollableView } from "../common/ScrollableView"

export interface LightBoxSelectionMenuProps {
  selectionMenu: SelectionMenu<any>;
}

@observer
export class LightBoxSelectionMenu extends React.Component<
  LightBoxSelectionMenuProps
> {

  public render(): React.ReactElement<any> {
    return (
      <SelectionMenuContainer>
        {this.renderTopBar()}
        {this.renderContent()}
      </SelectionMenuContainer>
    );
  }

  private renderTopBar(): React.ReactElement<any> {
    return (
      <TopBar>
        <ButtonLeftContainer>
          {this.props.selectionMenu.leftButton ? (
            <Button
              {...this.props.selectionMenu.leftButton}
              styles={this.props.selectionMenu.leftButton.styles}
            />
          ) : null}
        </ButtonLeftContainer>
        <TitleText>
          {this.props.selectionMenu.title}
        </TitleText>
        <ButtonRightContainer>
          {this.props.selectionMenu.rightButton ? (
            <Button
              {...this.props.selectionMenu.rightButton}
              styles={this.props.selectionMenu.rightButton.styles}
            />
          ) : null}
        </ButtonRightContainer>
      </TopBar>
    );
  }

  private renderContent(): React.ReactElement<any> {
    return (
      <ScrollableView>
      <ListContainer>
        {Array.from(this.props.selectionMenu.items).map(
          ([id, selectionItem], index): React.ReactElement<any> => {
            const isLast = index === this.props.selectionMenu.items.size - 1;
            return (
              <LightBoxSelectionItem
                key={id}
                item={selectionItem}
                isSelected={_.includes(
                  this.props.selectionMenu.selectedIds,
                  id,
                )}
                isLast={isLast}
              />
            );
          },
        )}
      </ListContainer>
      </ScrollableView>
    );
  }
}
