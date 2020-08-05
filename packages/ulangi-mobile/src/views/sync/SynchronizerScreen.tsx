/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableNetworkStore,
  ObservableScreen,
  ObservableSyncStore,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';

import { Images } from '../../constants/Images';
import { env } from '../../constants/env';
import { SynchronizerScreenIds } from '../../constants/ids/SynchronizerScreenIds';
import { SynchronizerScreenDelegate } from '../../delegates/sync/SynchronizerScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  SynchronizerScreenStyles,
  synchronizerScreenResponsiveStyles,
} from './SynchronizerScreen.styles';

export interface SynchronizerScreenProps {
  observableScreen: ObservableScreen;
  themeStore: ObservableThemeStore;
  networkStore: ObservableNetworkStore;
  syncStore: ObservableSyncStore;
  screenDelegate: SynchronizerScreenDelegate;
}

@observer
export class SynchronizerScreen extends React.Component<
  SynchronizerScreenProps
> {
  public get styles(): SynchronizerScreenStyles {
    return synchronizerScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={SynchronizerScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <SectionGroup
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          header="SYNC STATE">
          <SectionRow
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            customLeft={this.renderSyncState()}
            description={this.renderDescription()}
          />
        </SectionGroup>
      </Screen>
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
          <Image style={this.styles.icon} source={Images.CHECK_GREEN_14X14} />
          <DefaultText style={this.styles.sync_state}>In sync</DefaultText>
          <TouchableOpacity
            style={this.styles.sync_btn}
            onPress={this.props.screenDelegate.triggerSync}>
            <DefaultText style={this.styles.sync_btn_text}>
              Trigger sync
            </DefaultText>
          </TouchableOpacity>
        </View>
      );
    }
  }

  private renderDescription(): React.ReactElement<any> {
    if (env.OPEN_SOURCE_ONLY === false) {
      return (
        <View>
          <DefaultText style={this.styles.title}>Two-way syncing:</DefaultText>
          <DefaultText style={this.styles.paragraph}>
            When you're online, the synchronizer automatically backs up your
            data.
          </DefaultText>
          <DefaultText style={this.styles.paragraph}>
            It also automatically downloads changes you make from somewhere else
            (such as from the Google Sheets add-on, or from another device.)
          </DefaultText>
        </View>
      );
    } else {
      return (
        <View>
          <DefaultText style={this.styles.title}>One-way syncing:</DefaultText>
          <DefaultText style={this.styles.paragraph}>
            When you're online, the synchronizer automatically backs up your
            data.
          </DefaultText>
          <DefaultText
            style={
              this.styles.paragraph
            }>{`However, it does not automatically download new changes. If you make changes from somewhere else, tap 'Trigger sync' button to download them or use the ${Platform.select(
            { ios: 'App Store', android: 'Play Store' },
          )} version for two-way syncing.`}</DefaultText>
        </View>
      );
    }
  }
}
