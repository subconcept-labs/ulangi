/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { CategorySortType } from '@ulangi/ulangi-common/enums';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';

import { config } from '../../constants/config';
import { CategorySortMenuIds } from '../../constants/ids/CategorySortMenuIds';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

export class CategorySortMenuDelegate {
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
    selectedSortType: CategorySortType,
    onSelect: (filterType: CategorySortType) => void,
  ): void {
    this.navigatorDelegate.showSelectionMenu(
      {
        testID: CategorySortMenuIds.SORT_MENU,
        items: new Map(
          _.toPairs(config.category.sortMap).map(
            ([filterType, { name }]): [CategorySortType, SelectionItem] => {
              return [
                filterType as CategorySortType,
                {
                  testID: CategorySortMenuIds.SORT_BTN_BY_SORT_TYPE(
                    filterType as CategorySortType,
                  ),
                  text: _.upperFirst(name),
                  onPress: (): void => {
                    onSelect(filterType as CategorySortType);
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
