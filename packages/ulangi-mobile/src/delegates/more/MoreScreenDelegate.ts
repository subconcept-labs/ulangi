/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ButtonSize,
  ContactUsFormType,
  LightBoxState,
  ScreenName,
  Theme,
} from '@ulangi/ulangi-common/enums';
import { DarkModeSettings } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableCarouselMessage,
  ObservableDarkModeStore,
  ObservableLightBox,
  ObservableMoreScreen,
  ObservableUserStore,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { runInAction } from 'mobx';

import { config } from '../../constants/config';
import { MoreScreenIds } from '../../constants/ids/MoreScreenIds';
import { RootScreenDelegate } from '../../delegates/root/RootScreenDelegate';
import { BottomTabsStyle } from '../../styles/BottomTabsStyle';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { PrimaryScreenStyle } from '../../styles/PrimaryScreenStyle';
import { AdDelegate } from '../ad/AdDelegate';
import { AutoArchiveSettingsDelegate } from '../auto-archive/AutoArchiveSettingsDelegate';
import { DarkModeSettingsDelegate } from '../dark-mode/DarkModeSettingsDelegate';
import { LinkingDelegate } from '../linking/LinkingDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { InAppRatingDelegate } from '../rating/InAppRatingDelegate';
import { ReminderSettingsDelegate } from '../reminder/ReminderSettingsDelegate';

@boundClass
export class MoreScreenDelegate {
  private observer: Observer;
  private userStore: ObservableUserStore;
  private darkModeStore: ObservableDarkModeStore;
  private observableLightBox: ObservableLightBox;
  private observableScreen: ObservableMoreScreen;
  private rootScreenDelegate: RootScreenDelegate;
  private adDelegate: AdDelegate;
  private inAppRatingDelegate: InAppRatingDelegate;
  private autoArchiveSettingsDelegate: AutoArchiveSettingsDelegate;
  private reminderSettingsDelegate: ReminderSettingsDelegate;
  private darkModeSettingsDelegate: DarkModeSettingsDelegate;
  private linkingDelegate: LinkingDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observer: Observer,
    userStore: ObservableUserStore,
    darkModeStore: ObservableDarkModeStore,
    observableLightBox: ObservableLightBox,
    observableScreen: ObservableMoreScreen,
    rootScreenDelegate: RootScreenDelegate,
    adDelegate: AdDelegate,
    inAppRatingDelegate: InAppRatingDelegate,
    autoArchiveSettingsDelegate: AutoArchiveSettingsDelegate,
    reminderSettingsDelegate: ReminderSettingsDelegate,
    darkModeSettingsDelegate: DarkModeSettingsDelegate,
    linkingDelegate: LinkingDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observer = observer;
    this.userStore = userStore;
    this.darkModeStore = darkModeStore;
    this.observableScreen = observableScreen;
    this.observableLightBox = observableLightBox;
    this.rootScreenDelegate = rootScreenDelegate;
    this.adDelegate = adDelegate;
    this.inAppRatingDelegate = inAppRatingDelegate;
    this.autoArchiveSettingsDelegate = autoArchiveSettingsDelegate;
    this.reminderSettingsDelegate = reminderSettingsDelegate;
    this.darkModeSettingsDelegate = darkModeSettingsDelegate;
    this.linkingDelegate = linkingDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public autoShowInAppRating(): void {
    this.inAppRatingDelegate.autoShowInAppRating();
  }

  public autoUpdateBottomTabs(): void {
    this.observer.reaction(
      (): Theme => this.darkModeStore.theme,
      (theme): void => {
        this.rootScreenDelegate.mergeBottomTabsOptions({
          backgroundColor: BottomTabsStyle.getBackgroundColor(theme),
        });
      },
    );
  }

  public autoUpdateCarouselMessages(): void {
    this.observer.reaction(
      (): {
        isGuest: boolean;
        isPremium: boolean;
        isReminderActive: boolean;
      } => {
        return {
          isGuest: this.userStore.existingCurrentUser.email.endsWith(
            config.general.guestEmailDomain,
          ),
          isPremium: this.userStore.existingCurrentUser.isPremium,
          isReminderActive: this.isReminderActive(),
        };
      },
      ({ isGuest, isPremium, isReminderActive }): void => {
        runInAction(
          (): void => {
            this.observableScreen.messages.clear();
            if (isGuest) {
              this.observableScreen.messages.push(
                new ObservableCarouselMessage(
                  'set-up-account',
                  'IMPORANT',
                  "You're using a guest account. Set up now to prevent losing access to this account.",
                  '#5E35B1',
                  'Set up account',
                  '#4527A0',
                  this.navigateToSetUpAccountScreen,
                ),
              );
            }
            if (!isPremium) {
              this.observableScreen.messages.push(
                new ObservableCarouselMessage(
                  'open-source-projects',
                  'DID YOU KNOW',
                  'Ulangi is an open-source project. You can build more tools and features for it.',
                  '#1E88E5',
                  'See open-source projects',
                  '#1565C0',
                  this.navigateToOpenSourceProjectsScreen,
                ),
              );
            }
            if (!isReminderActive) {
              this.observableScreen.messages.push(
                new ObservableCarouselMessage(
                  'set-up-reminder',
                  'TIP',
                  'Set up daily reminder so you will not forget to review your flashcards.',
                  '#43A047',
                  'Set up reminder',
                  '#2E7D32',
                  this.navigateToReminderScreen,
                ),
              );
            }
          },
        );
      },
      {
        fireImmediately: true,
      },
    );
  }

  public rateThisApp(): void {
    this.inAppRatingDelegate.showInAppRating(false);
  }

  public logOut(): void {
    const message =
      this.userStore.existingCurrentUser.email.endsWith(
        config.general.guestEmailDomain,
      ) === true
        ? 'Warning: You have not set up this account yet. If you log out, you will not be able to access it again. Are you sure you want to log out?'
        : 'Are you sure you want to log out?';
    this.navigatorDelegate.showDialog(
      {
        message,
        closeOnTouchOutside: true,
        buttonList: [
          {
            testID: MoreScreenIds.NO_BTN,
            text: 'NO',
            onPress: (): void => {
              this.navigatorDelegate.dismissLightBox();
            },
            styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
              ButtonSize.SMALL,
            ),
          },
          {
            testID: MoreScreenIds.YES_BTN,
            text: 'YES',
            onPress: (): void => {
              this.navigatorDelegate.dismissLightBox();
              this.observer.when(
                (): boolean =>
                  this.observableLightBox.state === LightBoxState.UNMOUNTED,
                (): void =>
                  this.rootScreenDelegate.setRootToSingleScreen(
                    ScreenName.SIGN_OUT_SCREEN,
                  ),
              );
            },
            styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
              ButtonSize.SMALL,
            ),
          },
        ],
      },
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public isAutoArchiveEnabled(): boolean {
    return this.autoArchiveSettingsDelegate.getCurrentSettings()
      .autoArchiveEnabled;
  }

  public isReminderActive(): boolean {
    return this.reminderSettingsDelegate.isReminderActive();
  }

  public getDarkModeSettings(): DarkModeSettings {
    return this.darkModeSettingsDelegate.getCurrentSettings();
  }

  public getReadableReminderTime(): string {
    return this.reminderSettingsDelegate.getReadableTime();
  }

  public goToTwitter(): void {
    this.linkingDelegate.openLink(config.links.twitter);
  }

  public goToInstagram(): void {
    this.linkingDelegate.openLink(config.links.instagram);
  }

  public goToReddit(): void {
    this.linkingDelegate.openLink(config.links.reddit);
  }

  public navigateToSetUpAccountScreen(): void {
    this.navigatorDelegate.push(ScreenName.SET_UP_ACCOUNT_SCREEN, {});
  }

  public navigateToSecurityScreen(): void {
    this.navigatorDelegate.push(ScreenName.SECURITY_SCREEN, {});
  }

  public navigateToMembershipScreen(): void {
    this.navigatorDelegate.push(ScreenName.MEMBERSHIP_SCREEN, {});
  }

  public navigateToSetManagementScreen(): void {
    this.navigatorDelegate.push(ScreenName.SET_MANAGEMENT_SCREEN, {});
  }

  public navigateToSynchronizerScreen(): void {
    this.navigatorDelegate.push(ScreenName.SYNCHRONIZER_SCREEN, {});
  }

  public navigateToReminderScreen(): void {
    this.navigatorDelegate.push(ScreenName.REMINDER_SCREEN, {});
  }

  public navigateToDarkModeScreen(): void {
    this.navigatorDelegate.push(ScreenName.DARK_MODE_SCREEN, {});
  }

  public navigateToAutoArchiveScreen(): void {
    this.navigatorDelegate.push(ScreenName.AUTO_ARCHIVE_SCREEN, {});
  }

  public navigateToGoogleSheetsAddOnScreen(): void {
    this.navigatorDelegate.push(ScreenName.GOOGLE_SHEETS_ADD_ON_SCREEN, {});
  }

  public navigateToOpenSourceProjectsScreen(): void {
    this.navigatorDelegate.push(ScreenName.OPEN_SOURCE_PROJECTS_SCREEN, {});
  }

  public navigateToWhatsNewScreen(): void {
    this.navigatorDelegate.push(ScreenName.WHATS_NEW_SCREEN, {});
  }

  public navigateToFollowUsScreen(): void {
    this.navigatorDelegate.push(ScreenName.FOLLOW_US_SCREEN, {});
  }

  public navigateToQuickTutorialScreen(): void {
    this.navigatorDelegate.push(ScreenName.QUICK_TUTORIAL_SCREEN, {});
  }

  public navigateToFeatureRequestScreen(): void {
    this.navigatorDelegate.push(ScreenName.CONTACT_US_SCREEN, {
      initialFormType: ContactUsFormType.FEATURE_REQUEST,
    });
  }

  public navigateToReportABugScreen(): void {
    this.navigatorDelegate.push(ScreenName.CONTACT_US_SCREEN, {
      initialFormType: ContactUsFormType.REPORT_A_BUG,
    });
  }

  public navigateToContactSupportScreen(): void {
    this.navigatorDelegate.push(ScreenName.CONTACT_US_SCREEN, {
      initialFormType: ContactUsFormType.CONTACT_SUPPORT,
    });
  }

  public navigateToTermsOfServiceScreen(): void {
    this.navigatorDelegate.push(ScreenName.TERMS_OF_SERVICE_SCREEN, {});
  }

  public navigateToPrivacyPolicyScreen(): void {
    this.navigatorDelegate.push(ScreenName.PRIVACY_POLICY_SCREEN, {});
  }

  public showGoogleConsentForm(): void {
    this.adDelegate.showGoogleConsentForm();
  }
}
