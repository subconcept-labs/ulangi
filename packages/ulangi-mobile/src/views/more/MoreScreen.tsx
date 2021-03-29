/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { ButtonSize } from '@ulangi/ulangi-common/enums';
import {
  ObservableMoreScreen,
  ObservableNetworkStore,
  ObservableSetStore,
  ObservableSyncStore,
  ObservableThemeStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, ScrollView, View } from 'react-native';
import VersionInfo from 'react-native-version-info';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { env } from '../../constants/env';
import { MoreScreenIds } from '../../constants/ids/MoreScreenIds';
import { MoreScreenDelegate } from '../../delegates/more/MoreScreenDelegate';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { SectionGroup } from '../../views/section/SectionGroup';
import { SectionRow } from '../../views/section/SectionRow';
import { DefaultButton } from '../common/DefaultButton';
import { Rating } from '../common/Rating';
import { Screen } from '../common/Screen';
import { MessageCarousel } from './MessageCarousel';
import {
  MoreScreenStyles,
  moreScreenResponsiveStyles,
} from './MoreScreen.style';

export interface MoreScreenProps {
  themeStore: ObservableThemeStore;
  userStore: ObservableUserStore;
  setStore: ObservableSetStore;
  networkStore: ObservableNetworkStore;
  syncStore: ObservableSyncStore;
  observableScreen: ObservableMoreScreen;
  screenDelegate: MoreScreenDelegate;
}

@observer
export class MoreScreen extends React.Component<MoreScreenProps> {
  private get styles(): MoreScreenStyles {
    return moreScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        testID={MoreScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={false}
        style={this.styles.screen}>
        <ScrollView
          testID={MoreScreenIds.MORE_SCROLL_VIEW}
          style={this.styles.scroll_view_container}>
          <MessageCarousel
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            messages={this.props.observableScreen.messages}
            currentMessageIndex={
              this.props.observableScreen.currentMessageIndex
            }
          />
          <View style={this.styles.section_list}>{this.renderSections()}</View>
        </ScrollView>
      </Screen>
    );
  }

  private renderSections(): readonly React.ReactElement<any>[] {
    return [
      this.renderAccountSection(),
      this.renderToolsAndSettingsSection(),
      this.renderProjectsSection(),
      this.renderInfoSection(),
      this.renderLogOutSection(),
    ];
  }

  private renderAccountSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        key="account"
        header="ACCOUNT">
        {this.props.userStore.existingCurrentUser.email.endsWith(
          config.general.guestEmailDomain,
        ) ? (
          <SectionRow
            testID={MoreScreenIds.SET_UP_ACCOUNT_BTN}
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            leftText="Set Up Account"
            leftIcon={
              <Image
                style={this.styles.left_icon}
                source={Images.STAR_BLUE_12X12}
              />
            }
            showArrow={true}
            shrink="right"
            onPress={this.props.screenDelegate.navigateToSetUpAccountScreen}
          />
        ) : (
          <SectionRow
            testID={MoreScreenIds.SECURITY_BTN}
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            leftText="Security"
            rightText={this.props.userStore.existingCurrentUser.email}
            showArrow={true}
            shrink="right"
            onPress={this.props.screenDelegate.navigateToSecurityScreen}
          />
        )}
      </SectionGroup>
    );
  }

  private renderToolsAndSettingsSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        key="tools-and-settings"
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        header="TOOLS AND SETTINGS">
        <SectionRow
          testID={MoreScreenIds.SET_MANAGEMENT_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Set Management"
          rightText={`${
            assertExists(this.props.setStore.activeSetList).size
          } set${
            assertExists(this.props.setStore.activeSetList).size !== 1
              ? 's'
              : ''
          }`}
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToSetManagementScreen}
        />
        <SectionRow
          testID={MoreScreenIds.SYNCHRONIZER_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Synchronizer"
          rightText={
            this.props.networkStore.isConnected === false
              ? 'Offline'
              : this.props.syncStore.currentState === 'SYNCING'
              ? 'Syncing...'
              : 'In sync'
          }
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToSynchronizerScreen}
        />
        {env.OPEN_SOURCE_ONLY === false ? (
          <SectionRow
            testID={MoreScreenIds.REMINDER_BTN}
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            leftText="Reminder"
            rightText={
              this.props.screenDelegate.isReminderActive() === true
                ? this.props.screenDelegate
                    .getReadableReminderTime()
                    .toUpperCase()
                : 'Off'
            }
            showArrow={true}
            onPress={this.props.screenDelegate.navigateToReminderScreen}
          />
        ) : null}
        <SectionRow
          testID={MoreScreenIds.AUTO_ARCHIVE_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Auto Archive"
          rightText={
            this.props.screenDelegate.isAutoArchiveEnabled() === true
              ? 'On'
              : 'Off'
          }
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToAutoArchiveScreen}
        />
        <SectionRow
          testID={MoreScreenIds.DARK_MODE_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Theme Mode"
          rightText={this.props.screenDelegate.getThemeSettings().trigger}
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToThemeScreen}
        />
        <SectionRow
          testID={MoreScreenIds.SYNC_WITH_GOOGLE_SHEETS_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Sync with Google Sheets"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToGoogleSheetsAddOnScreen}
        />
      </SectionGroup>
    );
  }

  private renderProjectsSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        key="projects"
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        header="OUR PROJECTS">
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Ulangi App"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.goToGitHub}
          description="Ulangi is open-source on GitHub."
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Midterm App"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.goToMidterm}
          description="Midterm is a note-taking app designed for studying."
        />
        <SectionRow
          testID={MoreScreenIds.DICTIONARY_FUNCTIONS_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Dictionary Functions"
          rightText=""
          showArrow={true}
          onPress={(): void =>
            this.props.screenDelegate.showLink(
              'https://dictionaryfx.com',
              'dictionaryfx.com',
            )
          }
          description="Extract dictionary data using Google Sheets formulas."
        />
      </SectionGroup>
    );
  }

  private renderInfoSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        key="info"
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        header="INFO">
        <SectionRow
          testID={MoreScreenIds.RATE_THIS_APP_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Rate this app"
          customRight={
            <Rating
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              currentRating={
                this.props.userStore.existingCurrentUser.userRating
              }
              setRating={this.props.screenDelegate.setRating}
            />
          }
          showArrow={false}
        />
        <SectionRow
          testID={MoreScreenIds.VERSION_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Version"
          rightText={VersionInfo.appVersion}
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToWhatsNewScreen}
        />
        <SectionRow
          testID={MoreScreenIds.TERMS_OF_SERVICE_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Terms of Service"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToTermsOfServiceScreen}
        />
        <SectionRow
          testID={MoreScreenIds.PRIVACY_POLICY_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Privacy Policy"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToPrivacyPolicyScreen}
        />
      </SectionGroup>
    );
  }

  private renderLogOutSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        key="logout"
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}>
        <SectionRow
          testID={MoreScreenIds.LOG_OUT_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          customLeft={
            <DefaultButton
              text="Log Out"
              styles={fullRoundedButtonStyles.getSolidBackgroundStyles(
                ButtonSize.SMALL,
                'red',
                'white',
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={(): void => this.props.screenDelegate.logOut()}
            />
          }
        />
      </SectionGroup>
    );
  }
}
