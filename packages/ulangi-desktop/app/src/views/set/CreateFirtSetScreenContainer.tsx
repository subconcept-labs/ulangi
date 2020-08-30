import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';

@observer
export class CreateFirstSetScreenContainer extends Container {
  public render(): React.ReactElement {
    return <div>Create first set</div>;
  }
}
