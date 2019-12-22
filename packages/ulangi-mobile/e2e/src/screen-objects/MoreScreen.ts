import { MoreScreenIds } from '../../../src/constants/ids/MoreScreenIds';
import { Element } from '../adapters/Element';
import { TabScreen } from './TabScreen';

export class MoreScreen extends TabScreen {
  public getScreenElement(): Element {
    return Element.byId(MoreScreenIds.SCREEN);
  }

  public async navigateToSetUpAccountScreen(): Promise<void> {
    await Element.byId(MoreScreenIds.MORE_SCROLL_VIEW).scrollChildIntoView(
      Element.byId(MoreScreenIds.SET_UP_ACCOUNT_BTN),
      'down'
    );
    await Element.byId(MoreScreenIds.SET_UP_ACCOUNT_BTN).tap();
  }

  public async navigateToSecurityScreen(): Promise<void> {
    await Element.byId(MoreScreenIds.MORE_SCROLL_VIEW).scrollChildIntoView(
      Element.byId(MoreScreenIds.SECURITY_BTN),
      'down'
    );
    await Element.byId(MoreScreenIds.SECURITY_BTN).tap();
  }

  public async navigateToMembershipScreen(): Promise<void> {
    await Element.byId(MoreScreenIds.MORE_SCROLL_VIEW).scrollChildIntoView(
      Element.byId(MoreScreenIds.MEMBERSHIP_BTN),
      'down'
    );
    await Element.byId(MoreScreenIds.MEMBERSHIP_BTN).tap();
  }

  public async navigateToSetManagementScreen(): Promise<void> {
    await Element.byId(MoreScreenIds.MORE_SCROLL_VIEW).scrollChildIntoView(
      Element.byId(MoreScreenIds.SET_MANAGEMENT_BTN),
      'down'
    );
    await Element.byId(MoreScreenIds.SET_MANAGEMENT_BTN).tap();
  }

  public async navigateToAutoArchiveScreen(): Promise<void> {
    await Element.byId(MoreScreenIds.MORE_SCROLL_VIEW).scrollChildIntoView(
      Element.byId(MoreScreenIds.AUTO_ARCHIVE_BTN),
      'down'
    );
    await Element.byId(MoreScreenIds.AUTO_ARCHIVE_BTN).tap();
  }

  public async navigateToWhatsNewScreen(): Promise<void> {
    await Element.byId(MoreScreenIds.MORE_SCROLL_VIEW).scrollChildIntoView(
      Element.byId(MoreScreenIds.WHATS_NEW_BTN),
      'down'
    );
    await Element.byId(MoreScreenIds.WHATS_NEW_BTN).tap();
  }

  public async navigateToContactSupportScreen(): Promise<void> {
    await Element.byId(MoreScreenIds.MORE_SCROLL_VIEW).scrollChildIntoView(
      Element.byId(MoreScreenIds.CONTACT_SUPPORT_BTN),
      'down'
    );
    await Element.byId(MoreScreenIds.CONTACT_SUPPORT_BTN).tap();
  }

  public async navigateToFeatureRequestScreen(): Promise<void> {
    await Element.byId(MoreScreenIds.MORE_SCROLL_VIEW).scrollChildIntoView(
      Element.byId(MoreScreenIds.FEATURE_REQUEST_BTN),
      'down'
    );
    await Element.byId(MoreScreenIds.FEATURE_REQUEST_BTN).tap();
  }

  public async navigateToReportABugScreen(): Promise<void> {
    await Element.byId(MoreScreenIds.MORE_SCROLL_VIEW).scrollChildIntoView(
      Element.byId(MoreScreenIds.REPORT_A_BUG_BTN),
      'down'
    );
    await Element.byId(MoreScreenIds.REPORT_A_BUG_BTN).tap();
  }

  public async navigateToPrivacyPolicyScreen(): Promise<void> {
    await Element.byId(MoreScreenIds.MORE_SCROLL_VIEW).scrollChildIntoView(
      Element.byId(MoreScreenIds.PRIVACY_POLICY_BTN),
      'down'
    );
    await Element.byId(MoreScreenIds.PRIVACY_POLICY_BTN).tap();
  }

  public async navigateToTermsOfServiceScreen(): Promise<void> {
    await Element.byId(MoreScreenIds.MORE_SCROLL_VIEW).scrollChildIntoView(
      Element.byId(MoreScreenIds.TERMS_OF_SERVICE_BTN),
      'down'
    );
    await Element.byId(MoreScreenIds.TERMS_OF_SERVICE_BTN).tap();
  }

  public async logOut(): Promise<void> {
    await Element.byId(MoreScreenIds.MORE_SCROLL_VIEW).scrollChildIntoView(
      Element.byId(MoreScreenIds.LOG_OUT_BTN),
      'down'
    );
    await Element.byId(MoreScreenIds.LOG_OUT_BTN).tap();
    await Element.byId(MoreScreenIds.YES_BTN).tap();
  }

  public async expectSessionExpiredDialogToExist(): Promise<void> {
    await Element.byId(MoreScreenIds.SESSION_EXPIRED_DIALOG).expectToExist();
  }
}

export const moreScreen = new MoreScreen();
