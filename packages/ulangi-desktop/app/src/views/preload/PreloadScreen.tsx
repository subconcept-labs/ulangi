import { Theme } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Spinner } from '../common/Spinner';
import { Screen } from './PreloadScreen.style';

export const PreloadScreen = observer(
  (): React.ReactElement => (
    <Screen>
      <Spinner size="large" theme={Theme.DARK} />
    </Screen>
  ),
);
