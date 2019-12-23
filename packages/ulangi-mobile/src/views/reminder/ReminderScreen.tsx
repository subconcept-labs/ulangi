/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize } from '@ulangi/ulangi-common/enums';
import {
  ObservableDarkModeStore,
  ObservableNotificationStore,
  ObservableReminderScreen,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { ReminderScreenIds } from '../../constants/ids/ReminderScreenIds';
import { ReminderScreenDelegate } from '../../delegates/reminder/ReminderScreenDelegate';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';

export interface ReminderScreenProps {
  observableScreen: ObservableReminderScreen;
  notificationStore: ObservableNotificationStore;
  darkModeStore: ObservableDarkModeStore;
  screenDelegate: ReminderScreenDelegate;
}

@observer
export class ReminderScreen extends React.Component<ReminderScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={ReminderScreenIds.SCREEN}>
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
          isDarkModeEnabled={this.props.darkModeStore.systemMode === 'dark'}
        />
      </View>
    );
  }

  private renderSection(): React.ReactElement<any> {
    const reminderActive =
      this.props.observableScreen.reminderSettings.reminderEnabled === true &&
      this.props.notificationStore.hasPermission === true;

    return (
      <SectionGroup theme={this.props.darkModeStore.theme} key="reminder">
        <SectionRow
          theme={this.props.darkModeStore.theme}
          leftText="Daily Reminder"
          customRight={
            <DefaultButton
              testID={ReminderScreenIds.REMINDER_TOGGLE_BTN}
              text={reminderActive ? 'On' : 'Off'}
              styles={FullRoundedButtonStyle.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
              )}
              onPress={this.props.screenDelegate.toggle}
            />
          }
          description="Set up daily reminder so that you won't forget to review your flashcards."
        />
        <SectionRow
          theme={this.props.darkModeStore.theme}
          leftText="Time"
          customRight={
            <DefaultButton
              testID={ReminderScreenIds.SET_TIME_BTN}
              text={moment()
                .hours(this.props.observableScreen.reminderSettings.hours)
                .minutes(this.props.observableScreen.reminderSettings.minutes)
                .format('hh:mm a')
                .toUpperCase()}
              styles={FullRoundedButtonStyle.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
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
