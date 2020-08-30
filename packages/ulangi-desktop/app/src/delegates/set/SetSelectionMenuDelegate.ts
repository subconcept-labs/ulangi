/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ButtonSize, ScreenName } from '@ulangi/ulangi-common/enums';
import {
  SelectionItem,
  Set,
  SetSelectionMenuOptions,
} from '@ulangi/ulangi-common/interfaces';
import { EventBus } from '@ulangi/ulangi-event';
import { ObservableSetStore } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';

import { textButtonStyles } from '../../styles/TextButtonStyles';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { SelectionMenuDelegate } from "../selection-menu/SelectionMenuDelegate";

export class SetSelectionMenuDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private selectionMenuDelegate: SelectionMenuDelegate;
  private navigatorDelegate: NavigatorDelegate;
  
  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    selectionMenuDelegate: SelectionMenuDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.selectionMenuDelegate = selectionMenuDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public showActiveSetsForSetSelection(): void {
    this.showActiveSets(
      (selectedSetId): void => {
        this.eventBus.publish(
          createAction(ActionType.SET__SELECT, { setId: selectedSetId }),
        );
      },
    );
  }

  public showActiveSets(
    onSelect: (selectedSetId: string) => void,
    options?: SetSelectionMenuOptions,
  ): void {
    this.show(
      this.setStore.existingCurrentSetId,
      this.setStore.existingActiveSetList,
      onSelect,
      options,
    );
  }

  public show(
    currentSetId: string,
    setList: Map<string, Set>,
    onSelect: (selectedSetId: string) => void,
    options?: SetSelectionMenuOptions,
  ): void {
    const setArray = Array.from(setList.entries());
    this.selectionMenuDelegate.show(
      {
        items: new Map(
          setArray.map(
            ([setId, set]): [string, SelectionItem] => {
              return [
                setId,
                {
                  testID: set.setName,
                  text: set.setName,
                  icon: null,
                  onPress: (): void => {
                    onSelect(setId);
                    this.navigatorDelegate.dismissLightBox();
                  },
                },
              ];
            },
          ),
        ),
        selectedIds: [currentSetId],
        leftButton:
          options && options.hideLeftButton
            ? undefined
            : {
                testID: "MANAGE_BTN",
                text: 'Manage',
                onPress: (): void => {
                  this.navigatorDelegate.dismissLightBox();
                  this.navigatorDelegate.push(
                    ScreenName.SET_MANAGEMENT_SCREEN,
                    {},
                  );
                },
                styles: textButtonStyles.getNormalStyles(
                  ButtonSize.NORMAL
                ),
              },
        rightButton:
          options && options.hideRightButton
            ? undefined
            : {
                testID: "ADD_SET_BTN",
                text: 'Add',
                onPress: (): void => {
                  this.navigatorDelegate.dismissLightBox();
                  this.navigatorDelegate.push(ScreenName.ADD_SET_SCREEN, {});
                },
                styles: textButtonStyles.getNormalStyles(
                  ButtonSize.NORMAL
                ),
              },
        title: options && options.title ? options.title : 'Select',
      },
    );
  }
}
