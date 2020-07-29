import { ObservablePublicVocabularyDetailScreen } from '@ulangi/ulangi-observable';

import { PublicVocabularyDetailScreenDelegate } from '../../delegates/discover/PublicVocabularyDetailScreenDelegate';
import { SpeakDelegate } from '../../delegates/vocabulary/SpeakDelegate';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class PublicVocabularyDetailScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservablePublicVocabularyDetailScreen,
  ): PublicVocabularyDetailScreenDelegate {
    const dialogDelegate = this.createDialogDelegate(
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const speakDelegate = new SpeakDelegate(this.eventBus);

    return new PublicVocabularyDetailScreenDelegate(
      observableScreen,
      speakDelegate,
      dialogDelegate,
    );
  }
}
