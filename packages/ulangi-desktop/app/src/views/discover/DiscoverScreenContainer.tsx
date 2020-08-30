import { ActivityState, ScreenName } from '@ulangi/ulangi-common/enums';
import {
  ObservableDiscoverScreen,
  ObservablePublicSetListState,
  ObservablePublicVocabularyListState,
  ObservableTouchableTopBar,
  ObservableTranslationListState,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { DiscoverScreen } from './DiscoverScreen';

@observer
export class DiscoverScreenContainer extends Container {
  protected observableScreen = new ObservableDiscoverScreen(
    observable.box(''),
    observable.box(false),
    observable.box(false),
    observable.box(null),
    observable.box(null),
    new ObservablePublicSetListState(
      null,
      false,
      observable.box(ActivityState.INACTIVE),
      observable.box(false),
    ),
    new ObservablePublicVocabularyListState(
      null,
      false,
      observable.box(ActivityState.INACTIVE),
      observable.box(false),
    ),
    new ObservableTranslationListState(
      null,
      null,
      observable.box(ActivityState.INACTIVE),
      observable.box(undefined),
      observable.box(false),
    ),
    this.props.componentId,
    ScreenName.DISCOVER_SCREEN,
    new ObservableTouchableTopBar('', '', '', _.noop, null, null),
  );

  public render(): React.ReactElement {
    return (
      <DiscoverScreen 
        setStore={this.props.rootStore.setStore}
        observableScreen={this.observableScreen} 
      />
    )
  }
}
