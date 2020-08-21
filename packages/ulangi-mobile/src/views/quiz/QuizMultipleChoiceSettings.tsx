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

export interface QuizMultipleChoiceSettingsProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  multipleChoiceSettings: {
    selectedQuizSize: number;
  };
  showMultipleChoiceQuizSizeMenu: (
    pairs: readonly [number, string][],
    selectedQuizSize: number,
    onSelect: (size: number) => void,
  ) => void;
}

@observer
export class QuizMultipleChoiceSettings extends React.Component<
  QuizMultipleChoiceSettingsProps
> {
  public render(): React.ReactElement<any> {
    return (
      <SectionGroup
        theme={this.props.theme}
        screenLayout={this.props.screenLayout}
        key="multiple-choice-quiz"
        header="MULTIPLE CHOICE QUIZ">
        <SectionRow
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          leftText="Multiple Choice Quiz Size"
          shrink="left"
          description="Number of questions per multiple choice quiz"
          customRight={
            <DefaultButton
              testID={QuizSettingsScreenIds.MULTIPLE_CHOICE_QUIZ_SIZE_BTN}
              text={this.props.multipleChoiceSettings.selectedQuizSize.toString()}
              styles={fullRoundedButtonStyles.getPrimaryOutlineStyles(
                ButtonSize.SMALL,
                this.props.theme,
                this.props.screenLayout,
              )}
              onPress={(): void => {
                this.props.showMultipleChoiceQuizSizeMenu(
                  this.getQuizSizeValuePairs(),
                  this.props.multipleChoiceSettings.selectedQuizSize,
                  (size): void => {
                    this.props.multipleChoiceSettings.selectedQuizSize = size;
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
    return config.quiz.multipleChoice.selectableQuizSizes.map(function(
      size,
    ): [number, string] {
      return [size, size.toString()];
    });
  }
}
