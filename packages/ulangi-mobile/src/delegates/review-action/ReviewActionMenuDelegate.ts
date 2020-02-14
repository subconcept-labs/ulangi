import { Options } from '@ulangi/react-native-navigation';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ScreenName, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import { EventBus } from '@ulangi/ulangi-event';
import {
  ObservableLightBox,
  ObservableVocabulary,
} from '@ulangi/ulangi-observable';

import { ReviewActionMenuIds } from '../../constants/ids/ReviewActionMenuIds';
import { NavigatorDelegate } from '../../delegates/navigator/NavigatorDelegate';

export class ReviewActionMenuDelegate {
  private eventBus: EventBus;
  private observableLightBox: ObservableLightBox;
  private navigatorDelegate: NavigatorDelegate;

  private styles: {
    light: Options;
    dark: Options;
  };

  public constructor(
    eventBus: EventBus,
    observableLightBox: ObservableLightBox,
    navigatorDelegate: NavigatorDelegate,
    styles: {
      light: Options;
      dark: Options;
    },
  ) {
    this.eventBus = eventBus;
    this.observableLightBox = observableLightBox;
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(vocabulary: ObservableVocabulary): void {
    const items: SelectionItem[] = [];

    switch (vocabulary.vocabularyStatus) {
      case VocabularyStatus.ACTIVE:
        items.push(this.getArchiveButton(vocabulary));
        items.push(this.getDeleteButton(vocabulary));
        break;

      case VocabularyStatus.ARCHIVED:
        items.push(this.getRestoreButton(vocabulary));
        items.push(this.getDeleteButton(vocabulary));
        break;

      case VocabularyStatus.DELETED:
        items.push(this.getRestoreButton(vocabulary));
        items.push(this.getArchiveButton(vocabulary));
        break;
    }

    this.observableLightBox.actionMenu = {
      testID: ReviewActionMenuIds.ACTION_MENU,
      title: 'Action',
      items,
    };

    this.navigatorDelegate.showLightBox(
      ScreenName.LIGHT_BOX_ACTION_MENU_SCREEN,
      {},
      this.styles,
    );
  }

  public getArchiveButton(vocabulary: ObservableVocabulary): SelectionItem {
    return {
      testID: ReviewActionMenuIds.ARCHIVE_BTN,
      text: 'Archive',
      onPress: (): void => {
        const editedVocabulary = {
          vocabularyId: vocabulary.vocabularyId,
          vocabularyStatus: VocabularyStatus.ARCHIVED,
        };

        this.eventBus.publish(
          createAction(ActionType.VOCABULARY__EDIT, {
            vocabulary: editedVocabulary,
            setId: undefined,
          }),
        );

        vocabulary.vocabularyStatus = VocabularyStatus.ARCHIVED;
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  public getRestoreButton(vocabulary: ObservableVocabulary): SelectionItem {
    return {
      testID: ReviewActionMenuIds.RESTORE_BTN,
      text: 'Restore',
      onPress: (): void => {
        const editedVocabulary = {
          vocabularyId: vocabulary.vocabularyId,
          vocabularyStatus: VocabularyStatus.ACTIVE,
        };

        this.eventBus.publish(
          createAction(ActionType.VOCABULARY__EDIT, {
            vocabulary: editedVocabulary,
            setId: undefined,
          }),
        );

        vocabulary.vocabularyStatus = VocabularyStatus.ACTIVE;

        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  public getDeleteButton(vocabulary: ObservableVocabulary): SelectionItem {
    return {
      testID: ReviewActionMenuIds.DELETE_BTN,
      text: 'Delete',
      textColor: 'red',
      onPress: (): void => {
        const editedVocabulary = {
          vocabularyId: vocabulary.vocabularyId,
          vocabularyStatus: VocabularyStatus.DELETED,
        };

        this.eventBus.publish(
          createAction(ActionType.VOCABULARY__EDIT, {
            vocabulary: editedVocabulary,
            setId: undefined,
          }),
        );

        vocabulary.vocabularyStatus = VocabularyStatus.DELETED;

        this.navigatorDelegate.dismissLightBox();
      },
    };
  }
}
