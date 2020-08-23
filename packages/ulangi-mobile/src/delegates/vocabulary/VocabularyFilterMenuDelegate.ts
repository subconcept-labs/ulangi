/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';

import { config } from '../../constants/config';
import { VocabularyFilterMenuIds } from '../../constants/ids/VocabularyFilterMenuIds';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

export class VocabularyFilterMenuDelegate {
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
    },
  ) {
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(
    selectedVocabularyStatus: VocabularyStatus,
    onSelect: (filterType: VocabularyStatus) => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        testID: VocabularyFilterMenuIds.FILTER_MENU,
        items: new Map(
          _.toPairs(config.vocabulary.statusMap).map(
            ([vocabularyStatus, { name }]): [
              VocabularyStatus,
              SelectionItem
            ] => {
              return [
                vocabularyStatus as VocabularyStatus,
                {
                  testID: VocabularyFilterMenuIds.FILTER_BTN_BY_VOCABULARY_STATUS(
                    vocabularyStatus as VocabularyStatus,
                  ),
                  text: _.upperFirst(name),
                  onPress: (): void => {
                    onSelect(vocabularyStatus as VocabularyStatus);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedVocabularyStatus],
        title: 'Filter',
      },
      this.styles,
    );
  }
}
