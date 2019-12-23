/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { VocabularyFilterType } from '@ulangi/ulangi-common/enums';
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
    selectedFilterType: VocabularyFilterType,
    onSelect: (filterType: VocabularyFilterType) => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        testID: VocabularyFilterMenuIds.FILTER_MENU,
        items: new Map(
          _.toPairs(config.vocabulary.filterMap).map(
            ([filterType, { name }]): [VocabularyFilterType, SelectionItem] => {
              return [
                filterType as VocabularyFilterType,
                {
                  testID: VocabularyFilterMenuIds.FILTER_BTN_BY_FILTER_TYPE(
                    filterType as VocabularyFilterType,
                  ),
                  text: _.upperFirst(name),
                  onPress: (): void => {
                    onSelect(filterType as VocabularyFilterType);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedFilterType],
        title: 'Filter',
      },
      this.styles,
    );
  }
}
