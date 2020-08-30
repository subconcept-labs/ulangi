import { ObservableRootNavigation } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { StackNavigation } from './StackNavigation';

export interface RootNavigationProps {
  navigation: ObservableRootNavigation;
}

export const RootNavigation = observer(
  (props: RootNavigationProps): React.ReactElement => {
    return <StackNavigation stack={props.navigation.stack} />;
  },
);
