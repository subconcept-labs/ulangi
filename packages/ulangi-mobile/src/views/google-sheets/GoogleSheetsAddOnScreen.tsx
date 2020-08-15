/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableGoogleSheetsAddOnScreen,
  ObservableThemeStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { GoogleSheetsAddOnScreenIds } from '../../constants/ids/GoogleSheetsAddOnScreenIds';
import { GoogleSheetsAddOnScreenDelegate } from '../../delegates/google-sheets/GoogleSheetsAddOnScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { SmartScrollView } from '../common/SmartScrollView';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import {
  GoogleSheetsAddOnScreenStyles,
  googleSheetsAddOnScreenResponsiveStyles,
} from './GoogleSheetsAddOnScreen.style';

export interface GoogleSheetsAddOnScreenProps {
  observableScreen: ObservableGoogleSheetsAddOnScreen;
  themeStore: ObservableThemeStore;
  userStore: ObservableUserStore;
  screenDelegate: GoogleSheetsAddOnScreenDelegate;
}

@observer
export class GoogleSheetsAddOnScreen extends React.Component<
  GoogleSheetsAddOnScreenProps
> {
  public get styles(): GoogleSheetsAddOnScreenStyles {
    return googleSheetsAddOnScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={GoogleSheetsAddOnScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <SmartScrollView>
          <View style={this.styles.intro_container}>
            <DefaultText style={this.styles.intro_text}>
              Manage your data directly and remotely from Google Sheets
              documents.
            </DefaultText>
          </View>
          <View style={this.styles.section_container}>
            <SectionGroup
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              header="TUTORIALS">
              <SectionRow
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                leftText="Installation guide"
                showArrow={true}
                onPress={(): void =>
                  this.props.screenDelegate.showLink(
                    config.links.ulangiSheetsAddOn.installTutorial,
                    'Installation guide',
                  )
                }
              />
              <SectionRow
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                leftText="Usage guide"
                showArrow={true}
                onPress={(): void =>
                  this.props.screenDelegate.showLink(
                    config.links.ulangiSheetsAddOn.useTutorial,
                    'Usage guide',
                  )
                }
              />
            </SectionGroup>
          </View>
        </SmartScrollView>
      </Screen>
    );
  }
}
