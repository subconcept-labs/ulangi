/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize } from '@ulangi/ulangi-common/enums';
import { PublicVocabulary } from '@ulangi/ulangi-common/interfaces';
import { ObservablePublicSet } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import * as _ from 'lodash';
import { Linking } from 'react-native';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { PublicSetDetailScreenIds } from '../../constants/ids/PublicSetDetailScreenIds';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { AddVocabularyDelegate } from './AddVocabularyDelegate';
import { PublicVocabularyActionMenuDelegate } from './PublicVocabularyActionMenuDelegate';

@boundClass
export class PublicSetDetailScreenDelegate {
  private errorConverter = new ErrorConverter();

  private publicSet: ObservablePublicSet;
  private addVocabularyDelegate: AddVocabularyDelegate;
  private publicVocabularyActionMenuDelegate: PublicVocabularyActionMenuDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    publicSet: ObservablePublicSet,
    addVocabularyDelegate: AddVocabularyDelegate,
    publicVocabularyActionMenuDelegate: PublicVocabularyActionMenuDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.publicSet = publicSet;
    this.addVocabularyDelegate = addVocabularyDelegate;
    this.publicVocabularyActionMenuDelegate = publicVocabularyActionMenuDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public addVocabulary(publicVocabulary: PublicVocabulary): void {
    this.addVocabularyDelegate.addVocabularyFromPublicVocabulary(
      publicVocabulary,
      this.publicSet.title,
      {
        onAdding: this.showAddingDialog,
        onAddSucceeded: this.showAddSucceededDialog,
        onAddFailed: this.showAddFailedDialog,
      },
    );
  }

  public showAddAllDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message: 'Are you sure you want to add all the terms?',
        closeOnTouchOutside: true,
        onBackgroundPress: (): void => {
          this.navigatorDelegate.dismissLightBox();
        },
        buttonList: [
          {
            testID: PublicSetDetailScreenIds.CANCEL_BTN,
            text: 'CANCEL',
            onPress: (): void => {
              this.navigatorDelegate.dismissLightBox();
            },
            styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
              ButtonSize.SMALL,
            ),
          },
          {
            testID: PublicSetDetailScreenIds.CONFIRM_ADD_ALL_BTN,
            text: 'ADD ALL',
            onPress: (): void => {
              // Show adding dialog first
              this.showAddingDialog();

              _.delay((): void => {
                this.addVocabularyDelegate.addVocabularyFromPublicVocabularyList(
                  this.publicSet.vocabularyList,
                  this.publicSet.title,
                  {
                    onAddingAll: this.showAddingDialog,
                    onAddAllSucceeded: this.showAddSucceededDialog,
                    onAddAllFailed: this.showAddFailedDialog,
                  },
                );
              }, 500);
            },
            styles: FullRoundedButtonStyle.getFullPrimaryBackgroundStyles(
              ButtonSize.SMALL,
            ),
          },
        ],
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public openLink(link: string): void {
    Linking.openURL(link).catch(
      (err): void => console.error('An error occurred', err),
    );
  }

  public showPublicVocabularyActionMenu(vocabulary: PublicVocabulary): void {
    this.publicVocabularyActionMenuDelegate.show(vocabulary);
  }

  private showAddingDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message: 'Adding vocabulary. Please wait...',
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showAddSucceededDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.SUCCESS_DIALOG,
        message: 'Added successfully.',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showAddFailedDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        message: this.errorConverter.convertToMessage(errorCode),
        title: 'ADD FAILED',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }
}
