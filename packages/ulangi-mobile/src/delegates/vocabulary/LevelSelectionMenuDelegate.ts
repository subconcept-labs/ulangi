/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';

import { LevelSelectionMenuIds } from '../../constants/ids/LevelSelectionMenuIds';
import { NavigatorDelegate } from '../../delegates/navigator/NavigatorDelegate';

export class LevelSelectionMenuDelegate {
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
    range: [number, number],
    selectedLevel: number,
    onSelect: (level: number) => void,
  ): void {
    const [start, end] = range;
    this.navigatorDelegate.showSelectionMenu(
      {
        items: new Map(
          _.range(start, end + 1).map(
            (level): [number, SelectionItem] => {
              return [
                level,
                {
                  testID: LevelSelectionMenuIds.SELECT_LEVEL_BTN_BY_LEVEL(
                    level,
                  ),
                  text: 'Level ' + level,
                  onPress: (): void => {
                    onSelect(level);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [selectedLevel],
        title: 'Select',
      },
      this.styles,
    );
  }
}
