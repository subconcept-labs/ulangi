/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ContactUsFormType } from '@ulangi/ulangi-common/enums';
import {
  ObservableContactUsScreen,
  ObservableDarkModeStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { config } from '../../constants/config';
import { ContactUsScreenIds } from '../../constants/ids/ContactUsScreenIds';
import { DismissKeyboardView } from '../common/DismissKeyboardView';
import { ContactSupportForm } from './ContactSupportForm';
import { FeatureRequestForm } from './FeatureRequestForm';
import { ReportABugForm } from './ReportABugForm';
import { ReportAnErrorForm } from './ReportAnErrorForm';

export interface ContactUsScreenProps {
  darkModeStore: ObservableDarkModeStore;
  userStore: ObservableUserStore;
  observableScreen: ObservableContactUsScreen;
}

@observer
export class ContactUsScreen extends React.Component<ContactUsScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <DismissKeyboardView
        style={styles.screen}
        testID={ContactUsScreenIds.SCREEN}>
        {this.renderForm()}
      </DismissKeyboardView>
    );
  }

  private renderForm(): React.ReactElement<any> {
    if (
      this.props.observableScreen.formType === ContactUsFormType.FEATURE_REQUEST
    ) {
      return (
        <FeatureRequestForm
          theme={this.props.darkModeStore.theme}
          observableScreen={this.props.observableScreen}
        />
      );
    } else if (
      this.props.observableScreen.formType === ContactUsFormType.REPORT_A_BUG
    ) {
      return (
        <ReportABugForm
          theme={this.props.darkModeStore.theme}
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
          theme={this.props.darkModeStore.theme}
          observableScreen={this.props.observableScreen}
        />
      );
    } else {
      return (
        <ContactSupportForm
          theme={this.props.darkModeStore.theme}
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
