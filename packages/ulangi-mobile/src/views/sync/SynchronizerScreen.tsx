/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDarkModeStore,
  ObservableNetworkStore,
  ObservableSyncStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { SynchronizerScreenIds } from '../../constants/ids/SynchronizerScreenIds';
import { SynchronizerScreenDelegate } from '../../delegates/sync/SynchronizerScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  SynchronizerScreenStyles,
  darkStyles,
  lightStyles,
} from './SynchronizerScreen.styles';

export interface SynchronizerScreenProps {
  darkModeStore: ObservableDarkModeStore;
  networkStore: ObservableNetworkStore;
  syncStore: ObservableSyncStore;
  screenDelegate: SynchronizerScreenDelegate;
}

@observer
export class SynchronizerScreen extends React.Component<
  SynchronizerScreenProps
> {
  public get styles(): SynchronizerScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.screen} testID={SynchronizerScreenIds.SCREEN}>
        <SectionGroup
          theme={this.props.darkModeStore.theme}
          header="SYNC STATE"
        >
          <SectionRow
            theme={this.props.darkModeStore.theme}
            customLeft={this.renderSyncState()}
            description="The synchonizer automatically synchronizes your data with our remote servers. Whenever you're online, your data will be backed up automatically."
          />
        </SectionGroup>
      </View>
    );
  }

  private renderSyncState(): React.ReactElement<any> {
    if (this.props.networkStore.isConnected === false) {
      return <DefaultText style={this.styles.sync_state}>Offline</DefaultText>;
    } else if (this.props.syncStore.currentState === 'SYNCING') {
      return (
        <View style={this.styles.sync_state_container}>
          <ActivityIndicator style={this.styles.indicator} size="small" />
          <DefaultText style={this.styles.sync_state}>Syncing...</DefaultText>
        </View>
      );
    } else {
      return (
        <View style={this.styles.sync_state_container}>
          <Image style={this.styles.icon} source={Images.CHECK_GREEN_14x12} />
          <DefaultText style={this.styles.sync_state}>In sync</DefaultText>
          <TouchableOpacity
            style={this.styles.sync_btn}
            onPress={this.props.screenDelegate.triggerSync}
          >
            <DefaultText style={this.styles.sync_btn_text}>
              Trigger sync
            </DefaultText>
          </TouchableOpacity>
        </View>
      );
    }
  }
}
