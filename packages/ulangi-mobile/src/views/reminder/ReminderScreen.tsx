/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize } from '@ulangi/ulangi-common/enums';
import {
  ObservableNotificationStore,
  ObservableReminderScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { ReminderScreenIds } from '../../constants/ids/ReminderScreenIds';
import { ReminderScreenDelegate } from '../../delegates/reminder/ReminderScreenDelegate';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { Screen } from '../common/Screen';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';

export interface ReminderScreenProps {
  observableScreen: ObservableReminderScreen;
  notificationStore: ObservableNotificationStore;
  themeStore: ObservableThemeStore;
  screenDelegate: ReminderScreenDelegate;
}

@observer
export class ReminderScreen extends React.Component<ReminderScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={styles.screen}
        testID={ReminderScreenIds.SCREEN}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        {this.renderSection()}
        <DateTimePicker
          titleIOS="Pick a time"
          date={moment()
            .hours(this.props.observableScreen.reminderSettings.hours)
            .minutes(this.props.observableScreen.reminderSettings.minutes)
            .toDate()}
          isVisible={this.props.observableScreen.shouldShowTimePicker}
          mode="time"
          onConfirm={this.props.screenDelegate.handleTimePicked}
          onCancel={this.props.screenDelegate.handleTimeCanceled}
          isDarkModeEnabled={this.props.themeStore.systemMode === 'dark'}
        />
      </Screen>
    );
  }

  private renderSection(): React.ReactElement<any> {
    const reminderActive =
      this.props.observableScreen.reminderSettings.reminderEnabled === true &&
      this.props.notificationStore.hasPermission === true;

    return (
      <SectionGroup
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        key="reminder">
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Daily Reminder"
          customRight={
            <DefaultButton
              testID={ReminderScreenIds.REMINDER_TOGGLE_BTN}
              text={reminderActive ? 'On' : 'Off'}
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={this.props.screenDelegate.toggle}
            />
          }
          description="Set up daily reminder so that you won't forget to review your flashcards."
        />
        <SectionRow
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          leftText="Time"
          customRight={
            <DefaultButton
              testID={ReminderScreenIds.SET_TIME_BTN}
              text={moment()
                .hours(this.props.observableScreen.reminderSettings.hours)
                .minutes(this.props.observableScreen.reminderSettings.minutes)
                .format('hh:mm a')
                .toUpperCase()}
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.themeStore.theme,
                this.props.observableScreen.screenLayout,
              )}
              onPress={this.props.screenDelegate.showTimePicker}
            />
          }
          disabled={!reminderActive}
        />
      </SectionGroup>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
