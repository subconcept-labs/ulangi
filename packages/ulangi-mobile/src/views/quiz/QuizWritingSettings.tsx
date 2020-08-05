import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { config } from '../../constants/config';
import { QuizSettingsScreenIds } from '../../constants/ids/QuizSettingsScreenIds';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DefaultButton } from '../common/DefaultButton';
import { SectionGroup } from '../section/SectionGroup';
import { SectionRow } from '../section/SectionRow';
import { sectionRowResponsiveStyles } from './QuizSettingsScreen.style';

export interface QuizWritingSettingsProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  writingSettings: {
    selectedQuizSize: number;
    selectedAutoShowKeyboard: boolean;
  };
  showWritingQuizSizeMenu: (
    pairs: readonly [number, string][],
    selectedQuizSize: number,
    onSelect: (size: number) => void,
  ) => void;
  showWritingAutoShowKeyboardMenu: (
    pairs: readonly [boolean, string][],
    selectedAutoShowKeyboard: boolean,
    onSelect: (autoShowKeyboard: boolean) => void,
  ) => void;
}

@observer
export class QuizWritingSettings extends React.Component<
  QuizWritingSettingsProps
> {
  public render(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.theme}
        screenLayout={this.props.screenLayout}
        key="writing-quiz"
        header="WRITING QUIZ">
        <SectionRow
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          leftText="Quiz Size"
          description="Number of questions per writing quiz"
          shrink="left"
          customRight={
            <DefaultButton
              testID={QuizSettingsScreenIds.WRITING_QUIZ_SIZE_BTN}
              text={this.props.writingSettings.selectedQuizSize.toString()}
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.theme,
                this.props.screenLayout,
              )}
              onPress={(): void => {
                this.props.showWritingQuizSizeMenu(
                  this.getQuizSizeValuePairs(),
                  this.props.writingSettings.selectedQuizSize,
                  (size): void => {
                    this.props.writingSettings.selectedQuizSize = size;
                  },
                );
              }}
            />
          }
          styles={sectionRowResponsiveStyles}
        />
        <SectionRow
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          leftText="Auto-Show Keyboard"
          description="Automatically show keyboard for each term."
          shrink="left"
          customRight={
            <DefaultButton
              testID={QuizSettingsScreenIds.WRITING_AUTO_SHOW_KEYBOARD_BTN}
              text={
                this.props.writingSettings.selectedAutoShowKeyboard
                  ? 'Yes'
                  : 'No'
              }
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.theme,
                this.props.screenLayout,
              )}
              onPress={(): void => {
                this.props.showWritingAutoShowKeyboardMenu(
                  this.getAutoShowKeyboardValuePairs(),
                  this.props.writingSettings.selectedAutoShowKeyboard,
                  (autoShowKeyboard): void => {
                    this.props.writingSettings.selectedAutoShowKeyboard = autoShowKeyboard;
                  },
                );
              }}
            />
          }
          styles={sectionRowResponsiveStyles}
        />
      </SectionGroup>
    );
  }

  private getQuizSizeValuePairs(): readonly [number, string][] {
    return config.quiz.writing.selectableQuizSizes.map(function(
      size,
    ): [number, string] {
      return [size, size.toString()];
    });
  }

  private getAutoShowKeyboardValuePairs(): readonly [boolean, string][] {
    return [[true, 'Yes'], [false, 'No']];
  }
}
