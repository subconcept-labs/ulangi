import {
  ObservableLightBox,
  ObservableScreen,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { NavigatorDelegate } from '../../delegates/navigator/NavigatorDelegate';
import { LightBoxAnimatableView } from './LightBoxAnimatableView';
import { LightBoxDialog } from './LightBoxDialog';
import { Screen } from './LightBoxDialogScreen.style';
import { LightBoxTouchableBackground } from './LightBoxTouchableBackground';

export interface LightBoxDialogScreenProps {
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableScreen;
  navigatorDelegate: NavigatorDelegate;
}

@observer
export class LightBoxDialogScreen extends React.Component<
  LightBoxDialogScreenProps
> {
  public render(): null | React.ReactElement {
    if (this.props.observableLightBox.dialog === null) {
      return null;
    } else {
      return (
        <Screen>
          <LightBoxTouchableBackground
            style={{ padding: '16px' }}
            enabled={this.isBackgroundTouchable()}
            onPress={(): void => this.onBackgroundPress()}>
            <LightBoxAnimatableView>
              <LightBoxDialog
                dialog={this.props.observableLightBox.dialog}
                close={(): void => this.close()}
              />
            </LightBoxAnimatableView>
          </LightBoxTouchableBackground>
        </Screen>
      );
    }
  }

  private close(): void {
    this.props.navigatorDelegate.dismissLightBox();
  }

  private isBackgroundTouchable(): boolean {
    const dialog = this.props.observableLightBox.dialog;
    return (
      dialog !== null &&
      (dialog.closeOnTouchOutside === true ||
        typeof dialog.onBackgroundPress !== 'undefined')
    );
  }

  private onBackgroundPress(): void {
    const dialog = this.props.observableLightBox.dialog;
    if (dialog !== null) {
      if (dialog.closeOnTouchOutside === true) {
        this.close();
      }

      if (typeof dialog.onBackgroundPress !== 'undefined') {
        dialog.onBackgroundPress();
      }
    }
  }
}
