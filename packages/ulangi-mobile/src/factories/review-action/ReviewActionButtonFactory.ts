import { ObservableReviewActionButton } from '@ulangi/ulangi-observable';

import { Images } from '../../constants/Images';
import { ReviewActionBarIds } from '../../constants/ids/ReviewActionBarIds';

export class ReviewActionButtonFactory {
  public createPreviousButton(
    isDisabled: boolean,
    onPress: () => void,
  ): ObservableReviewActionButton {
    return new ObservableReviewActionButton(
      'PREVIOUS',
      undefined,
      ReviewActionBarIds.PREVIOUS_BTN,
      {
        light: Images.ARROW_LEFT_BLACK_24X24,
        dark: Images.ARROW_LEFT_MILK_24X24,
      },
      isDisabled,
      false,
      onPress,
    );
  }

  public createSkipButton(
    isDisabled: boolean,
    onPress: () => void,
  ): ObservableReviewActionButton {
    return new ObservableReviewActionButton(
      'SKIP',
      undefined,
      ReviewActionBarIds.SKIP_BTN,
      {
        light: Images.ARROW_RIGHT_BLACK_24X24,
        dark: Images.ARROW_RIGHT_MILK_24X24,
      },
      isDisabled,
      false,
      onPress,
    );
  }

  public createShowAnswerButton(
    onPress: () => void,
  ): ObservableReviewActionButton {
    return new ObservableReviewActionButton(
      'SHOW ANSWER',
      undefined,
      ReviewActionBarIds.SHOW_ANSWER_BTN,
      {
        light: Images.EYE_BLACK_24X24,
        dark: Images.EYE_MILK_24X24,
      },
      false,
      false,
      onPress,
    );
  }

  public createPlayAudioButton(
    subtitle: string,
    onPress: () => void,
  ): ObservableReviewActionButton {
    return new ObservableReviewActionButton(
      'PLAY AUDIO',
      subtitle,
      ReviewActionBarIds.PLAY_AUDIO_BTN,
      {
        light: Images.SPEAKER_BLACK_24X24,
        dark: Images.SPEAKER_MILK_24X24,
      },
      false,
      false,
      onPress,
    );
  }

  public createEditButton(onPress: () => void): ObservableReviewActionButton {
    return new ObservableReviewActionButton(
      'EDIT',
      '',
      ReviewActionBarIds.EDIT_BTN,
      {
        light: Images.EDIT_BLACK_24X24,
        dark: Images.EDIT_MILK_24X24,
      },
      false,
      false,
      onPress,
    );
  }

  public createMoreButton(onPress: () => void): ObservableReviewActionButton {
    return new ObservableReviewActionButton(
      'MORE',
      undefined,
      ReviewActionBarIds.MORE_BTN,
      {
        light: Images.MORE_BLACK_24X24,
        dark: Images.MORE_MILK_24X24,
      },
      false,
      false,
      onPress,
    );
  }
}
