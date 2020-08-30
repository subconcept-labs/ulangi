import { ObservableDiscoverScreen, ObservableSetStore } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { TopBar } from '../common/TopBar';
import { SetSelectionButton } from '../set/SetSelectionButton';
import { Screen } from './DiscoverScreen.style';

export interface DiscoverScreenProps {
  setStore: ObservableSetStore
  observableScreen: ObservableDiscoverScreen;
}

@observer
export class DiscoverScreen extends React.Component<DiscoverScreenProps> {
  public render(): React.ReactElement {
    return (
      <Screen>
        {this.props.observableScreen.topBar !== null ? (
          <TopBar 
            title={
              <SetSelectionButton 
                currentSetName={this.props.setStore.existingCurrentSet.setName}
                showMenu={(): void => {}}
              />
            } 
          />
        ) : null}
      </Screen>
    );
  }
}
