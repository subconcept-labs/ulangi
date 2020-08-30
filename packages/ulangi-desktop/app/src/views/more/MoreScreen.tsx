import { ObservableMoreScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { TopBar } from '../common/TopBar';
import { Screen } from './MoreScreen.style';

export interface MoreScreenProps {
  observableScreen: ObservableMoreScreen;
}

@observer
export class MoreScreen extends React.Component<MoreScreenProps> {
  public render(): React.ReactElement {
    return (
      <Screen>
        {this.props.observableScreen.topBar !== null &&
        this.props.observableScreen.topBar.kind === 'title' ? (
          <TopBar title={this.props.observableScreen.topBar.title} />
        ) : null}
      </Screen>
    );
  }
}
