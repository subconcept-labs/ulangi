import { ObservableNavigationComponent } from '@ulangi/ulangi-observable';
import { IObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import {
  Avatar,
  AvatarText,
  BottomContainer,
  Email,
  EmailContainer,
  LoggedInAs,
  MenuContainer,
  MenuItem,
  MenuItemIcon,
  MenuItemText,
  SideBarContainer,
  TopContainer,
  Touchable,
  TouchableText,
} from './SideBar.style';

export interface SideBarProps {
  selectableComponents: IObservableArray<ObservableNavigationComponent>;
  selectedIndex: number;
  selectIndex: (index: number) => void;
  logOut: () => void;
}

export const SideBar = observer(
  (props: SideBarProps): React.ReactElement => (
    <SideBarContainer>
      <TopContainer>
        <Avatar>
          <AvatarText>J</AvatarText>
        </Avatar>
        <EmailContainer>
          <LoggedInAs>Logged in as</LoggedInAs>
          <Email>j***@yahoo.com</Email>
        </EmailContainer>
      </TopContainer>
      <MenuContainer>
        {props.selectableComponents.map(
          (component, index): React.ReactElement => {
            return (
              <MenuItem
                key={component.componentName}
                style={
                  props.selectedIndex === index
                    ? { backgroundColor: '#0176a0', opacity: 1.0 }
                    : {}
                }
                onClick={(): void => props.selectIndex(index)}>
                <MenuItemIcon src={component.componentIcon} />
                <MenuItemText>{component.componentName}</MenuItemText>
              </MenuItem>
            );
          },
        )}
      </MenuContainer>
      <BottomContainer>
        <Touchable onClick={props.logOut}>
          <TouchableText>Log out</TouchableText>
        </Touchable>
      </BottomContainer>
    </SideBarContainer>
  ),
);
