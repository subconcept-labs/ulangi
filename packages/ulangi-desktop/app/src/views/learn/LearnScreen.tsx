import { ObservableScreen, ObservableSetStore } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { TopBar } from '../common/TopBar';
import { SetSelectionButton } from '../set/SetSelectionButton';
import { Screen } from './LearnScreen.style';

export interface LearnScreenProps {
  setStore: ObservableSetStore;
  observableScreen: ObservableScreen;
}

@observer
export class LearnScreen extends React.Component<LearnScreenProps> {
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
