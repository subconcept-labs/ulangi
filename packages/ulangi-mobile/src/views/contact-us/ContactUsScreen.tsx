/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ContactUsFormType } from '@ulangi/ulangi-common/enums';
import {
  ObservableContactUsScreen,
  ObservableThemeStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { config } from '../../constants/config';
import { ContactUsScreenIds } from '../../constants/ids/ContactUsScreenIds';
import { DismissKeyboardView } from '../common/DismissKeyboardView';
import { Screen } from '../common/Screen';
import { ContactSupportForm } from './ContactSupportForm';
import { FeatureRequestForm } from './FeatureRequestForm';
import { ReportABugForm } from './ReportABugForm';
import { ReportAnErrorForm } from './ReportAnErrorForm';

export interface ContactUsScreenProps {
  themeStore: ObservableThemeStore;
  userStore: ObservableUserStore;
  observableScreen: ObservableContactUsScreen;
}

@observer
export class ContactUsScreen extends React.Component<ContactUsScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={styles.screen}
        testID={ContactUsScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <DismissKeyboardView>{this.renderForm()}</DismissKeyboardView>
      </Screen>
    );
  }

  private renderForm(): React.ReactElement<any> {
    if (
      this.props.observableScreen.formType === ContactUsFormType.FEATURE_REQUEST
    ) {
      return (
        <FeatureRequestForm
          theme={this.props.themeStore.theme}
          observableScreen={this.props.observableScreen}
        />
      );
    } else if (
      this.props.observableScreen.formType === ContactUsFormType.REPORT_A_BUG
    ) {
      return (
        <ReportABugForm
          theme={this.props.themeStore.theme}
          observableScreen={this.props.observableScreen}
          isGuestEmail={this.props.userStore.existingCurrentUser.email.endsWith(
            config.general.guestEmailDomain,
          )}
          replyToEmail={this.props.userStore.existingCurrentUser.email}
        />
      );
    } else if (
      this.props.observableScreen.formType === ContactUsFormType.REPORT_AN_ERROR
    ) {
      return (
        <ReportAnErrorForm
          theme={this.props.themeStore.theme}
          observableScreen={this.props.observableScreen}
        />
      );
    } else {
      return (
        <ContactSupportForm
          theme={this.props.themeStore.theme}
          observableScreen={this.props.observableScreen}
          isGuestEmail={this.props.userStore.existingCurrentUser.email.endsWith(
            config.general.guestEmailDomain,
          )}
          replyToEmail={this.props.userStore.existingCurrentUser.email}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
