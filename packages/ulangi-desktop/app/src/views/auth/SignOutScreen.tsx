import { Theme } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Spinner } from '../common/Spinner';
import { Screen } from './SignOutScreen.style';

export const SignOutScreen = observer(
  (): React.ReactElement => (
    <Screen>
      <Spinner size="large" theme={Theme.DARK} />
    </Screen>
  ),
);
