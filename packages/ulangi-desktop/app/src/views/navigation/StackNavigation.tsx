import { ObservableStackNavigation } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Provider } from '../../Provider';
import { NavigationComponent, Stack } from './StackNavigation.style';

export interface StackNavigationProps {
  stack: ObservableStackNavigation;
  style?: React.CSSProperties;
}

export const StackNavigation = observer(
  (props: StackNavigationProps): React.ReactElement => (
    <Stack style={props.style}>
      {props.stack.components.map(
        (component): React.ReactElement<any> => {
          return (
            <NavigationComponent key={component.componentId}>
              <Provider
                componentId={component.componentId}
                passedProps={component.passedProps}
              />
            </NavigationComponent>
          );
        },
      )}
      {props.stack.lightBox !== null ? (
        <NavigationComponent key={props.stack.lightBox.componentId}>
          <Provider
            componentId={props.stack.lightBox.componentId}
            passedProps={props.stack.lightBox.passedProps}
          />
        </NavigationComponent>
      ) : null}
    </Stack>
  ),
);
