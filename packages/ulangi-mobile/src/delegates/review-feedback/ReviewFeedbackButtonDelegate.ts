import { Feedback } from '@ulangi/ulangi-common/enums';

export class ReviewFeedbackButtonDelegate {
  public getButtonsToShow(
    numberOfFeedbackButtons: 3 | 4 | 5,
  ): readonly Feedback[] {
    let buttonsToShow = [Feedback.POOR, Feedback.GOOD, Feedback.SUPERB];

    switch (numberOfFeedbackButtons) {
      case 4:
        buttonsToShow = [
          Feedback.POOR,
          Feedback.FAIR,
          Feedback.GOOD,
          Feedback.SUPERB,
        ];
        break;

      case 5:
        buttonsToShow = [
          Feedback.POOR,
          Feedback.FAIR,
          Feedback.GOOD,
          Feedback.GREAT,
          Feedback.SUPERB,
        ];
    }

    return buttonsToShow;
  }
}
