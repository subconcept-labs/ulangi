/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ButtonSize, ScreenName } from '@ulangi/ulangi-common/enums';
import {
  SelectionItem,
  Set,
  SetSelectionMenuOptions,
} from '@ulangi/ulangi-common/interfaces';
import { EventBus, on } from '@ulangi/ulangi-event';
import {
  ObservableScreen,
  ObservableSetStore,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';

import { Images } from '../../constants/Images';
import { SetSelectionMenuIds } from '../../constants/ids/SetSelectionMenuIds';
import { TextButtonStyle } from '../../styles/TextButtonStyle';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

export class SetSelectionMenuDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private navigatorDelegate: NavigatorDelegate;
  private styles: {
    light: Options;
    dark: Options;
  };

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    navigatorDelegate: NavigatorDelegate,
    styles: {
      light: Options;
      dark: Options;
    },
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
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

  public autoUpdateSubtitleOnSetChange(
    observableScreen: ObservableScreen,
  ): void {
    this.eventBus.subscribe(
      on(
        ActionType.SET__SELECT,
        (): void => {
          if (
            observableScreen.topBar !== null &&
            observableScreen.topBar.kind === 'touchable'
          ) {
            observableScreen.topBar.text = this.setStore.existingCurrentSet.setName;
            observableScreen.topBar.icon = _.has(
              Images.FLAG_ICONS_BY_LANGUAGE_CODE,
              this.setStore.existingCurrentSet.learningLanguageCode,
            )
              ? _.get(
                  Images.FLAG_ICONS_BY_LANGUAGE_CODE,
                  this.setStore.existingCurrentSet.learningLanguageCode,
                )
              : Images.FLAG_ICONS_BY_LANGUAGE_CODE.any;
          }
        },
      ),
    );
  }

  public show(
    currentSetId: string,
    setList: Map<string, Set>,
    onSelect: (selectedSetId: string) => void,
    options?: SetSelectionMenuOptions,
  ): void {
    const setArray = Array.from(setList.entries());
    this.navigatorDelegate.showSelectionMenu(
      {
        items: new Map(
          setArray.map(
            ([setId, set]): [string, SelectionItem] => {
              return [
                setId,
                {
                  testID: SetSelectionMenuIds.SELECT_SET_BTN_BY_SET_NAME(
                    set.setName,
                  ),
                  text: set.setName,
                  icon: _.has(
                    Images.FLAG_ICONS_BY_LANGUAGE_CODE,
                    set.learningLanguageCode,
                  )
                    ? _.get(
                        Images.FLAG_ICONS_BY_LANGUAGE_CODE,
                        set.learningLanguageCode,
                      )
                    : Images.FLAG_ICONS_BY_LANGUAGE_CODE.any,
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
                testID: SetSelectionMenuIds.MANAGE_BTN,
                text: 'Manage',
                onPress: (): void => {
                  this.navigatorDelegate.dismissLightBox();
                  this.navigatorDelegate.push(
                    ScreenName.SET_MANAGEMENT_SCREEN,
                    {},
                  );
                },
                styles: TextButtonStyle.getNormalStyles(ButtonSize.NORMAL),
              },
        rightButton:
          options && options.hideRightButton
            ? undefined
            : {
                testID: SetSelectionMenuIds.ADD_SET_BTN,
                text: 'Add',
                onPress: (): void => {
                  this.navigatorDelegate.dismissLightBox();
                  this.navigatorDelegate.push(ScreenName.ADD_SET_SCREEN, {});
                },
                styles: TextButtonStyle.getNormalStyles(ButtonSize.NORMAL),
              },
        title: options && options.title ? options.title : 'Select',
      },
      this.styles,
    );
  }
}
