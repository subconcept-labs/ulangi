/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableAdStore,
  ObservableDarkModeStore,
  ObservableMoreScreen,
  ObservableNetworkStore,
  ObservableSyncStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, ScrollView, View } from 'react-native';
import VersionInfo from 'react-native-version-info';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { MoreScreenIds } from '../../constants/ids/MoreScreenIds';
import { MoreScreenDelegate } from '../../delegates/more/MoreScreenDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { SectionGroup } from '../../views/section/SectionGroup';
import { SectionRow } from '../../views/section/SectionRow';
import { DefaultButton } from '../common/DefaultButton';
import { MessageCarousel } from './MessageCarousel';
import {
  MoreScreenStyles,
  darkStyles,
  lightStyles,
  premiumMembershipSectionRowDarkStyles,
  premiumMembershipSectionRowLightStyles,
  regularMembershipSectionRowDarkStyles,
  regularMembershipSectionRowLightStyles,
} from './MoreScreen.style';

export interface MoreScreenProps {
  darkModeStore: ObservableDarkModeStore;
  userStore: ObservableUserStore;
  networkStore: ObservableNetworkStore;
  syncStore: ObservableSyncStore;
  adStore: ObservableAdStore;
  observableScreen: ObservableMoreScreen;
  screenDelegate: MoreScreenDelegate;
}

@observer
export class MoreScreen extends React.Component<MoreScreenProps> {
  public get styles(): MoreScreenStyles {
    return this.props.darkModeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View testID={MoreScreenIds.SCREEN} style={this.styles.screen}>
        <ScrollView
          testID={MoreScreenIds.MORE_SCROLL_VIEW}
          style={this.styles.scroll_view_container}>
          <MessageCarousel
            theme={this.props.darkModeStore.theme}
            messages={this.props.observableScreen.messages}
            currentMessageIndex={
              this.props.observableScreen.currentMessageIndex
            }
          />
          <View style={this.styles.section_list}>{this.renderSections()}</View>
        </ScrollView>
      </View>
    );
  }

  private renderSections(): readonly React.ReactElement<any>[] {
    return [
      this.renderAccountSection(),
      this.renderToolsAndSettingsSection(),
      this.renderGeneralSection(),
      this.renderContactUsSection(),
      this.renderFAQSection(),
      this.renderLogOutSection(),
    ];
  }

  private renderAccountSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.darkModeStore.theme}
        key="account"
        header="ACCOUNT">
        {this.props.userStore.existingCurrentUser.email.endsWith(
          config.general.guestEmailDomain,
        ) ? (
          <SectionRow
            testID={MoreScreenIds.SET_UP_ACCOUNT_BTN}
            theme={this.props.darkModeStore.theme}
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
            theme={this.props.darkModeStore.theme}
            leftText="Security"
            rightText={this.props.userStore.existingCurrentUser.email}
            showArrow={true}
            shrink="right"
            onPress={this.props.screenDelegate.navigateToSecurityScreen}
          />
        )}
        <SectionRow
          testID={MoreScreenIds.MEMBERSHIP_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Account Type"
          rightText={
            this.props.userStore.existingCurrentUser.isPremium === true
              ? 'Premium'
              : 'Free'
          }
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToMembershipScreen}
          styles={{
            light: this.props.userStore.existingCurrentUser.isPremium
              ? premiumMembershipSectionRowLightStyles
              : regularMembershipSectionRowLightStyles,
            dark: this.props.userStore.existingCurrentUser.isPremium
              ? premiumMembershipSectionRowDarkStyles
              : regularMembershipSectionRowDarkStyles,
          }}
        />
      </SectionGroup>
    );
  }

  private renderToolsAndSettingsSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.darkModeStore.theme}
        key="tools-and-settings"
        header="TOOLS AND SETTINGS">
        <SectionRow
          testID={MoreScreenIds.SET_MANAGEMENT_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Set Management"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToSetManagementScreen}
        />
        <SectionRow
          testID={MoreScreenIds.SYNCHRONIZER_BTN}
          theme={this.props.darkModeStore.theme}
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
        <SectionRow
          testID={MoreScreenIds.REMINDER_BTN}
          theme={this.props.darkModeStore.theme}
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
        <SectionRow
          testID={MoreScreenIds.AUTO_ARCHIVE_BTN}
          theme={this.props.darkModeStore.theme}
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
          theme={this.props.darkModeStore.theme}
          leftText="Dark Mode"
          rightText={this.props.screenDelegate.getDarkModeSettings().trigger}
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToDarkModeScreen}
        />
        <SectionRow
          testID={MoreScreenIds.SYNC_WITH_GOOGLE_SHEETS_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Sync with Google Sheets"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToGoogleSheetsAddOnScreen}
        />
      </SectionGroup>
    );
  }

  private renderContactUsSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.darkModeStore.theme}
        key="contact-us"
        header="CONTACT US">
        <SectionRow
          testID={MoreScreenIds.FEATURE_REQUEST_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Feature Request"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToFeatureRequestScreen}
        />
        <SectionRow
          testID={MoreScreenIds.REPORT_A_BUG_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Report a Bug"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToReportABugScreen}
        />
        <SectionRow
          testID={MoreScreenIds.CONTACT_SUPPORT_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Contact Support"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToContactSupportScreen}
        />
      </SectionGroup>
    );
  }

  private renderFAQSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.darkModeStore.theme}
        key="about"
        header="ABOUT">
        <SectionRow
          testID={MoreScreenIds.VERSION_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Version"
          rightText={VersionInfo.appVersion}
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToWhatsNewScreen}
        />
        {this.props.adStore.isRequestLocationInEeaOrUnknown === true ? (
          <SectionRow
            testID={MoreScreenIds.AD_CONSENT_BTN}
            theme={this.props.darkModeStore.theme}
            leftText="Ad Consent"
            rightText=""
            showArrow={true}
            onPress={this.props.screenDelegate.showGoogleConsentForm}
          />
        ) : null}
        {this.props.adStore.isRequestLocationInEeaOrUnknown === true ? (
          <SectionRow
            testID={MoreScreenIds.DATA_SHARING_BTN}
            theme={this.props.darkModeStore.theme}
            leftText="Data Sharing"
            rightText=""
            showArrow={true}
            onPress={this.props.screenDelegate.navigateToDataSharingScreen}
          />
        ) : null}
        <SectionRow
          testID={MoreScreenIds.TERMS_OF_SERVICE_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Terms of Service"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToTermsOfServiceScreen}
        />
        <SectionRow
          testID={MoreScreenIds.PRIVACY_POLICY_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Privacy Policy"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToPrivacyPolicyScreen}
        />
      </SectionGroup>
    );
  }

  private renderGeneralSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.darkModeStore.theme}
        key="general"
        header="GENERAL">
        <SectionRow
          testID={MoreScreenIds.OPEN_SOURCE_PROJECTS_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Open-Source Projects"
          showArrow={true}
          onPress={(): void => {
            this.props.screenDelegate.navigateToOpenSourceProjectsScreen();
          }}
        />
        <SectionRow
          testID={MoreScreenIds.RATE_THIS_APP_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Rate This App"
          showArrow={true}
          onPress={(): void => {
            this.props.screenDelegate.rateThisApp();
          }}
        />
        <SectionRow
          testID={MoreScreenIds.WHATS_NEW_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="What's New"
          showArrow={true}
          onPress={(): void => {
            this.props.screenDelegate.navigateToWhatsNewScreen();
          }}
        />
        <SectionRow
          testID={MoreScreenIds.FOLLOW_US_ON_TWITTER_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Follow Us on Twitter"
          leftIcon={
            <Image
              style={this.styles.left_icon}
              source={Images.TWITTER_20x20}
            />
          }
          showArrow={true}
          onPress={(): void => {
            this.props.screenDelegate.goToTwitter();
          }}
        />
        <SectionRow
          testID={MoreScreenIds.FOLLOW_US_ON_INSTAGRAM_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Follow Us on Instagram"
          leftIcon={
            <Image
              style={this.styles.left_icon}
              source={Images.INSTAGRAM_20x20}
            />
          }
          showArrow={true}
          onPress={(): void => {
            this.props.screenDelegate.goToInstagram();
          }}
        />
        <SectionRow
          testID={MoreScreenIds.JOIN_OUR_COMMUNITY_BTN}
          theme={this.props.darkModeStore.theme}
          leftText="Join our Reddit community"
          leftIcon={
            <Image style={this.styles.left_icon} source={Images.REDDIT_20x20} />
          }
          showArrow={true}
          onPress={(): void => {
            this.props.screenDelegate.goToReddit();
          }}
        />
      </SectionGroup>
    );
  }

  private renderLogOutSection(): React.ReactElement<any> {
    return (
      <SectionGroup theme={this.props.darkModeStore.theme} key="logout">
        <SectionRow
          theme={this.props.darkModeStore.theme}
          testID={MoreScreenIds.LOG_OUT_BTN}
          customLeft={
            <DefaultButton
              text="Log Out"
              styles={FullRoundedButtonStyle.getFullBackgroundStyles(
                ButtonSize.SMALL,
                'red',
                'white',
              )}
              onPress={(): void => this.props.screenDelegate.logOut()}
            />
          }
        />
      </SectionGroup>
    );
  }
}
