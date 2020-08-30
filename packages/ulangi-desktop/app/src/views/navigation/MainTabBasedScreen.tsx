import { ObservableNavigationTabBasedComponent } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Provider } from '../../Provider';
import { MainTabBasedScreenDelegate } from '../../delegates/navigation/MainTabBasedScreenDelegate';
import { ContentContainer, Wrapper } from './MainTabBasedScreen.style';
import { SideBar } from './SideBar';
import { NavigationComponent } from './StackNavigation.style';

export interface MainTabBasedScreenProps {
  tabBasedComponent: ObservableNavigationTabBasedComponent;
  screenDelegate: MainTabBasedScreenDelegate;
}

export const MainTabBasedScreen = observer(
  (props: MainTabBasedScreenProps): React.ReactElement => (
    <Wrapper>
      <SideBar
        selectableComponents={props.tabBasedComponent.selectableComponents}
        selectedIndex={props.tabBasedComponent.selectedComponentIndex}
        selectIndex={(index: number): void => {
          props.tabBasedComponent.selectedComponentIndex = index;
        }}
        logOut={props.screenDelegate.logOut}
      />
      <ContentContainer>
        {props.tabBasedComponent.selectableComponents.map(
          (component, index): React.ReactElement => {
            return (
              <NavigationComponent
                style={{
                  zIndex:
                    index === props.tabBasedComponent.selectedComponentIndex
                      ? 0
                      : -1,
                }}
                key={component.componentId}>
                <Provider
                  componentId={component.componentId}
                  passedProps={component.passedProps}
                />
              </NavigationComponent>
            );
          },
        )}
      </ContentContainer>
    </Wrapper>
  ),
);
