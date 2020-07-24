/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { VocabularySortType } from '@ulangi/ulangi-common/enums';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';

import { config } from '../../constants/config';
import { VocabularySortMenuIds } from '../../constants/ids/VocabularySortMenuIds';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

export class VocabularySortMenuDelegate {
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
    selectedSortType: VocabularySortType,
    onSelect: (sortType: VocabularySortType) => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        testID: VocabularySortMenuIds.SORT_MENU,
        items: new Map(
          _.toPairs(config.vocabulary.sortMap).map(
            ([sortType, { name }]): [VocabularySortType, SelectionItem] => {
              return [
                sortType as VocabularySortType,
                {
                  testID: VocabularySortMenuIds.SORT_BTN_BY_SORT_TYPE(
                    sortType as VocabularySortType,
                  ),
                  text: _.upperFirst(name),
                  onPress: (): void => {
                    onSelect(sortType as VocabularySortType);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedSortType],
        title: 'Sort',
      },
      this.styles,
    );
  }
}
