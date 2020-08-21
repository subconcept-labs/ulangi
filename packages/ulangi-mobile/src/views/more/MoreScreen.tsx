/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize } from '@ulangi/ulangi-common/enums';
import {
  ObservableAdStore,
  ObservableMoreScreen,
  ObservableNetworkStore,
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
import { Screen } from '../common/Screen';
import { MessageCarousel } from './MessageCarousel';
import {
  MoreScreenStyles,
  moreScreenResponsiveStyles,
  premiumSectionRowResponsiveStyles,
  regularSectionRowResponsiveStyles,
} from './MoreScreen.style';

export interface MoreScreenProps {
  themeStore: ObservableThemeStore;
  userStore: ObservableUserStore;
  networkStore: ObservableNetworkStore;
  syncStore: ObservableSyncStore;
  adStore: ObservableAdStore;
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
      this.renderGeneralSection(),
      this.renderProjectsSection(),
      this.renderContactUsSection(),
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
        {env.OPEN_SOURCE_ONLY === false ? (
          <SectionRow
            testID={MoreScreenIds.MEMBERSHIP_BTN}
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            leftText="Account Type"
            rightText={
              this.props.userStore.existingCurrentUser.isPremium === true
                ? 'Premium'
                : 'Free'
            }
            showArrow={true}
            onPress={this.props.screenDelegate.navigateToMembershipScreen}
            styles={
              this.props.userStore.existingCurrentUser.isPremium
                ? premiumSectionRowResponsiveStyles
                : regularSectionRowResponsiveStyles
            }
          />
        ) : null}
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
          rightText=""
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
        header="PROJECTS">
        <SectionRow
          testID={MoreScreenIds.SOURCE_CODE_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Ulangi Open Source Project"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.goToGitHub}
          description="View Ulangi source code on GitHub."
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
          description="Extract dictionary data easily using Google Sheets formulas and import them to your favorite learning apps."
        />
      </SectionGroup>
    );
  }

  private renderContactUsSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        key="contact-us"
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        header="CONTACT US">
        <SectionRow
          testID={MoreScreenIds.FEATURE_REQUEST_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Feature Request"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToFeatureRequestScreen}
        />
        <SectionRow
          testID={MoreScreenIds.REPORT_A_BUG_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Report a Bug"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToReportABugScreen}
        />
        <SectionRow
          testID={MoreScreenIds.CONTACT_SUPPORT_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Contact Support"
          rightText=""
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToContactSupportScreen}
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
          testID={MoreScreenIds.VERSION_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Version"
          rightText={VersionInfo.appVersion}
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToWhatsNewScreen}
        />
        {env.OPEN_SOURCE_ONLY === false &&
        this.props.adStore.isRequestLocationInEeaOrUnknown === true ? (
          <SectionRow
            testID={MoreScreenIds.AD_CONSENT_BTN}
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            leftText="Ad Consent"
            rightText=""
            showArrow={true}
            onPress={this.props.screenDelegate.showGoogleConsentForm}
          />
        ) : null}
        {env.OPEN_SOURCE_ONLY === false &&
        this.props.adStore.isRequestLocationInEeaOrUnknown === true ? (
          <SectionRow
            testID={MoreScreenIds.DATA_SHARING_BTN}
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            leftText="Data Sharing"
            rightText=""
            showArrow={true}
            onPress={this.props.screenDelegate.navigateToDataSharingScreen}
          />
        ) : null}
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
        <SectionRow
          testID={MoreScreenIds.EVENT_LOGS_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Event Logs"
          showArrow={true}
          onPress={this.props.screenDelegate.navigateToEventLogsScreen}
        />
      </SectionGroup>
    );
  }

  private renderGeneralSection(): React.ReactElement<any> {
    return (
      <SectionGroup
        key="general"
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        header="GENERAL">
        <SectionRow
          testID={MoreScreenIds.RATE_THIS_APP_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Rate This App"
          showArrow={true}
          description="Please give us feedback or suggestions to make this app better."
          onPress={(): void => {
            this.props.screenDelegate.rateThisApp();
          }}
        />
        <SectionRow
          testID={MoreScreenIds.WHATS_NEW_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="What's New"
          showArrow={true}
          onPress={(): void => {
            this.props.screenDelegate.navigateToWhatsNewScreen();
          }}
        />
        <SectionRow
          testID={MoreScreenIds.FOLLOW_US_ON_TWITTER_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
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
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
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
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
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
