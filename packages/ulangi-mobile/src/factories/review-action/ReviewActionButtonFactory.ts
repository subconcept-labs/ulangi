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
        light: Images.ARROW_LEFT_BLACK_25X25,
        dark: Images.ARROW_LEFT_MILK_25X25,
      },
      isDisabled,
      false,
      onPress,
    );
  }

  public createNextButton(onPress: () => void): ObservableReviewActionButton {
    return new ObservableReviewActionButton(
      'NEXT',
      undefined,
      ReviewActionBarIds.NEXT_BTN,
      {
        light: Images.ARROW_RIGHT_BLACK_25X25,
        dark: Images.ARROW_RIGHT_MILK_25X25,
      },
      false,
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
        light: Images.EYE_BLACK_25X25,
        dark: Images.EYE_MILK_25X25,
      },
      false,
      false,
      onPress,
    );
  }

  public createPlayAudioButton(
    subtitle: string,
    testIDSuffix: string,
    onPress: () => void,
  ): ObservableReviewActionButton {
    return new ObservableReviewActionButton(
      'PLAY AUDIO',
      subtitle,
      ReviewActionBarIds.PLAY_AUDIO_BTN_BY_VALUE(testIDSuffix),
      {
        light: Images.SPEAKER_BLACK_25X25,
        dark: Images.SPEAKER_MILK_25X25,
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
        light: Images.EDIT_BLACK_25X25,
        dark: Images.EDIT_MILK_25X25,
      },
      false,
      false,
      onPress,
    );
  }

  public createDisableButton(
    onPress: () => void,
  ): ObservableReviewActionButton {
    return new ObservableReviewActionButton(
      'DISABLE',
      undefined,
      ReviewActionBarIds.DISABLE_BTN,
      {
        light: Images.CROSS_BLACK_25X25,
        dark: Images.CROSS_MILK_25X25,
      },
      false,
      false,
      onPress,
    );
  }
}
