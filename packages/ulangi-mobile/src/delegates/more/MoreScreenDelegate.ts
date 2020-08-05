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
import { ButtonStyles, ThemeSettings } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableCarouselMessage,
  ObservableLightBox,
  ObservableMoreScreen,
  ObservableThemeStore,
  ObservableUserStore,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { runInAction } from 'mobx';

import { config } from '../../constants/config';
import { env } from '../../constants/env';
import { MoreScreenIds } from '../../constants/ids/MoreScreenIds';
import { RootScreenDelegate } from '../../delegates/root/RootScreenDelegate';
import { bottomTabsStyles } from '../../styles/BottomTabsStyles';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { AdDelegate } from '../ad/AdDelegate';
import { AutoArchiveSettingsDelegate } from '../auto-archive/AutoArchiveSettingsDelegate';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { LinkingDelegate } from '../linking/LinkingDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { InAppRatingDelegate } from '../rating/InAppRatingDelegate';
import { ReminderSettingsDelegate } from '../reminder/ReminderSettingsDelegate';
import { ThemeSettingsDelegate } from '../theme/ThemeSettingsDelegate';

@boundClass
export class MoreScreenDelegate {
  private observer: Observer;
  private userStore: ObservableUserStore;
  private themeStore: ObservableThemeStore;
  private observableLightBox: ObservableLightBox;
  private observableScreen: ObservableMoreScreen;
  private rootScreenDelegate: RootScreenDelegate;
  private adDelegate: AdDelegate;
  private inAppRatingDelegate: InAppRatingDelegate;
  private autoArchiveSettingsDelegate: AutoArchiveSettingsDelegate;
  private reminderSettingsDelegate: ReminderSettingsDelegate;
  private themeSettingsDelegate: ThemeSettingsDelegate;
  private linkingDelegate: LinkingDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observer: Observer,
    userStore: ObservableUserStore,
    themeStore: ObservableThemeStore,
    observableLightBox: ObservableLightBox,
    observableScreen: ObservableMoreScreen,
    rootScreenDelegate: RootScreenDelegate,
    adDelegate: AdDelegate,
    inAppRatingDelegate: InAppRatingDelegate,
    autoArchiveSettingsDelegate: AutoArchiveSettingsDelegate,
    reminderSettingsDelegate: ReminderSettingsDelegate,
    themeSettingsDelegate: ThemeSettingsDelegate,
    linkingDelegate: LinkingDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observer = observer;
    this.userStore = userStore;
    this.themeStore = themeStore;
    this.observableScreen = observableScreen;
    this.observableLightBox = observableLightBox;
    this.rootScreenDelegate = rootScreenDelegate;
    this.adDelegate = adDelegate;
    this.inAppRatingDelegate = inAppRatingDelegate;
    this.autoArchiveSettingsDelegate = autoArchiveSettingsDelegate;
    this.reminderSettingsDelegate = reminderSettingsDelegate;
    this.themeSettingsDelegate = themeSettingsDelegate;
    this.linkingDelegate = linkingDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public autoUpdateBottomTabs(): void {
    this.observer.reaction(
      (): Theme => this.themeStore.theme,
      (theme): void => {
        this.rootScreenDelegate.mergeBottomTabsOptions({
          backgroundColor: bottomTabsStyles.getBackgroundColor(theme),
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
      ({ isGuest, isReminderActive }): void => {
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

            this.observableScreen.messages.push(
              new ObservableCarouselMessage(
                'sync-with-google-sheets',
                'DID YOU KNOW',
                'You can import, export and manage your data via a spreadsheet document.',
                '#43A047',
                'Sync with Google Sheets',
                '#2E7D32',
                this.navigateToGoogleSheetsAddOnScreen,
              ),
            );

            if (!isReminderActive && env.OPEN_SOURCE_ONLY === false) {
              this.observableScreen.messages.push(
                new ObservableCarouselMessage(
                  'set-up-reminder',
                  'TIP',
                  'Set up daily reminder so you will not forget to review your words.',
                  '#1E88E5',
                  'Set up reminder',
                  '#1565C0',
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
    this.dialogDelegate.show({
      message,
      closeOnTouchOutside: true,
      buttonList: [
        {
          testID: MoreScreenIds.NO_BTN,
          text: 'NO',
          onPress: (): void => {
            this.navigatorDelegate.dismissLightBox();
          },
          styles: (theme, layout): ButtonStyles =>
            fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
              ButtonSize.SMALL,
              theme,
              layout,
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
          styles: (theme, layout): ButtonStyles =>
            fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
              ButtonSize.SMALL,
              theme,
              layout,
            ),
        },
      ],
    });
  }

  public isAutoArchiveEnabled(): boolean {
    return this.autoArchiveSettingsDelegate.getCurrentSettings()
      .autoArchiveEnabled;
  }

  public isReminderActive(): boolean {
    return this.reminderSettingsDelegate.isReminderActive();
  }

  public getThemeSettings(): ThemeSettings {
    return this.themeSettingsDelegate.getCurrentSettings();
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

  public goToGitHub(): void {
    this.linkingDelegate.openLink(config.links.github);
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

  public navigateToThemeScreen(): void {
    this.navigatorDelegate.push(ScreenName.THEME_SCREEN, {});
  }

  public navigateToAutoArchiveScreen(): void {
    this.navigatorDelegate.push(ScreenName.AUTO_ARCHIVE_SCREEN, {});
  }

  public navigateToGoogleSheetsAddOnScreen(): void {
    this.navigatorDelegate.push(ScreenName.GOOGLE_SHEETS_ADD_ON_SCREEN, {});
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

  public navigateToDataSharingScreen(): void {
    this.navigatorDelegate.push(ScreenName.DATA_SHARING_SCREEN, {});
  }

  public navigateToEventLogsScreen(): void {
    this.navigatorDelegate.push(ScreenName.EVENT_LOGS_SCREEN, {});
  }

  public showGoogleConsentForm(): void {
    this.adDelegate.showGoogleConsentForm();
  }

  public goToDictionaryFunctionsWebsite(): void {
    this.linkingDelegate.openLink('https://dictionaryfx.com');
  }
}
