/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ScreenName, SetStatus } from '@ulangi/ulangi-common/enums';
import { SelectionItem } from '@ulangi/ulangi-common/interfaces';
import { EventBus } from '@ulangi/ulangi-event';
import { ObservableLightBox, ObservableSet } from '@ulangi/ulangi-observable';

import { SetActionMenuIds } from '../../constants/ids/SetActionMenuIds';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

export class SetActionMenuDelegate {
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
    }
  ) {
    this.eventBus = eventBus;
    this.observableLightBox = observableLightBox;
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(set: ObservableSet): void {
    switch (set.setStatus) {
      case SetStatus.ACTIVE:
        this.observableLightBox.actionMenu = {
          testID: SetActionMenuIds.ACTION_MENU,
          title: 'Action',
          items: [
            this.getUseButton(set),
            this.getEditButton(set),
            this.getArchiveButton(set),
            this.getDeleteButton(set),
          ],
        };
        break;

      case SetStatus.ARCHIVED:
        this.observableLightBox.actionMenu = {
          title: 'Action',
          items: [
            this.getEditButton(set),
            this.getRestoreButton(set),
            this.getDeleteButton(set),
          ],
        };
        break;

      case SetStatus.DELETED:
        this.observableLightBox.actionMenu = {
          title: 'Action',
          items: [
            this.getEditButton(set),
            this.getRestoreButton(set),
            this.getArchiveButton(set),
          ],
        };
        break;

      default:
        throw new Error('The default branch should not be reached');
    }

    this.navigatorDelegate.showLightBox(
      ScreenName.LIGHT_BOX_ACTION_MENU_SCREEN,
      {},
      this.styles
    );
  }

  private getUseButton(set: ObservableSet): SelectionItem {
    return {
      testID: SetActionMenuIds.USE_THIS_SET_BTN,
      text: 'Use this set',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.eventBus.publish(
          createAction(ActionType.SET__SELECT, {
            setId: set.setId,
          })
        );
      },
    };
  }

  private getEditButton(set: ObservableSet): SelectionItem {
    return {
      testID: SetActionMenuIds.EDIT_BTN,
      text: 'Edit',
      onPress: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.push(ScreenName.EDIT_SET_SCREEN, {
          originalSet: set,
        });
      },
    };
  }

  private getRestoreButton(set: ObservableSet): SelectionItem {
    return {
      testID: SetActionMenuIds.RESTORE_BTN,
      text: 'Restore',
      onPress: (): void => {
        this.eventBus.publish(
          createAction(ActionType.SET__EDIT, {
            set: {
              setId: set.setId,
              setStatus: SetStatus.ACTIVE,
            },
          })
        );
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  private getArchiveButton(set: ObservableSet): SelectionItem {
    return {
      testID: SetActionMenuIds.ARCHIVE_BTN,
      text: 'Archive',
      onPress: (): void => {
        this.eventBus.publish(
          createAction(ActionType.SET__EDIT, {
            set: {
              setId: set.setId,
              setStatus: SetStatus.ARCHIVED,
            },
          })
        );
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  private getDeleteButton(set: ObservableSet): SelectionItem {
    return {
      testID: SetActionMenuIds.DELETE_BTN,
      text: 'Delete',
      textColor: 'red',
      onPress: (): void => {
        this.eventBus.publish(
          createAction(ActionType.SET__EDIT, {
            set: {
              setId: set.setId,
              setStatus: SetStatus.DELETED,
            },
          })
        );
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }
}
