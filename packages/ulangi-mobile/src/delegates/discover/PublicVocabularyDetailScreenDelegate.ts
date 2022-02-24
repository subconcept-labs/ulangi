import { ActivityState } from '@ulangi/ulangi-common/enums';
import { ObservablePublicVocabularyDetailScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { DialogDelegate } from '../dialog/DialogDelegate';
import { SpeakDelegate } from '../vocabulary/SpeakDelegate';

@boundClass
export class PublicVocabularyDetailScreenDelegate {
  private observableScreen: ObservablePublicVocabularyDetailScreen;
  private speakDelegate: SpeakDelegate;
  private dialogDelegate: DialogDelegate;

  public constructor(
    observableScreen: ObservablePublicVocabularyDetailScreen,
    speakDelegate: SpeakDelegate,
    dialogDelegate: DialogDelegate,
  ) {
    this.observableScreen = observableScreen;
    this.speakDelegate = speakDelegate;
    this.dialogDelegate = dialogDelegate;
  }

  public changeStrokeOrderForm(
    form: 'unknown' | 'traditional' | 'simplified',
  ): void {
    this.observableScreen.strokeOrderForm = form;
  }

  public synthesizeAndSpeak(text: string, languageCode: string): void {
    this.speakDelegate.synthesize(text, languageCode, {
      onSynthesizing: (): void => {
        this.observableScreen.speakState.set(ActivityState.ACTIVE);
      },
      onSynthesizeSucceeded: (filePath): void => {
        this.speak(filePath);
      },
      onSynthesizeFailed: (errorBag): void => {
        this.observableScreen.speakState.set(ActivityState.ERROR);
        this.dialogDelegate.showFailedDialog(errorBag);
      },
    });
  }

  private speak(filePath: string): void {
    this.speakDelegate.speak(filePath, {
      onSpeaking: (): void => {
        this.observableScreen.speakState.set(ActivityState.ACTIVE);
      },
      onSpeakSucceeded: (): void => {
        this.observableScreen.speakState.set(ActivityState.INACTIVE);
      },
      onSpeakFailed: (): void => {
        this.observableScreen.speakState.set(ActivityState.INACTIVE);
      },
    });
  }
}
