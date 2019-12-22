/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ManageListType, VocabularyStatus } from '@ulangi/ulangi-common/enums';

import { ManageListSelectionMenuIds } from '../../constants/ids/ManageListSelectionMenuIds';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

export class ManageListSelectionMenuDelegate {
  private navigatorDelegate: NavigatorDelegate;
  private styles: {
    light: Options;
    dark: Options;
  };

  public constructor(
    navigatorDelegate: NavigatorDelegate,
    styles: {
      light: Options;
      dark: Options;
    }
  ) {
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(
    selectedListType: ManageListType,
    onSelect: (
      listType: ManageListType,
      vocabularyStatus: VocabularyStatus
    ) => void
  ): void {
    const items = new Map();
    items.set(ManageListType.CATEGORY_LIST, {
      testID: ManageListSelectionMenuIds.SELECT_LIST_BTN_BY_LIST_TYPE(
        'categoryList'
      ),
      text: 'Group by category',
      onPress: (): void => {
        onSelect(ManageListType.CATEGORY_LIST, VocabularyStatus.ACTIVE);
        this.navigatorDelegate.dismissLightBox();
      },
    });
    items.set(ManageListType.VOCABULARY_LIST, {
      testID: ManageListSelectionMenuIds.SELECT_LIST_BTN_BY_LIST_TYPE(
        'vocabularyList'
      ),
      text: 'Show all terms',
      onPress: (): void => {
        onSelect(ManageListType.VOCABULARY_LIST, VocabularyStatus.ACTIVE);
        this.navigatorDelegate.dismissLightBox();
      },
    });

    this.navigatorDelegate.showSelectionMenu(
      {
        items,
        selectedIds: [selectedListType],
        title: 'Select',
      },
      this.styles
    );
  }
}
