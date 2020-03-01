/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, ErrorCode } from '@ulangi/ulangi-common/enums';
import { ErrorBag, PublicVocabulary } from '@ulangi/ulangi-common/interfaces';
import { ObservablePublicSet } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import * as _ from 'lodash';
import { Linking } from 'react-native';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { PublicSetDetailScreenIds } from '../../constants/ids/PublicSetDetailScreenIds';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { AddVocabularyDelegate } from './AddVocabularyDelegate';
import { PublicVocabularyActionMenuDelegate } from './PublicVocabularyActionMenuDelegate';

@boundClass
export class PublicSetDetailScreenDelegate {
  private publicSet: ObservablePublicSet;
  private addVocabularyDelegate: AddVocabularyDelegate;
  private publicVocabularyActionMenuDelegate: PublicVocabularyActionMenuDelegate;
  private dialogDelegate: DialogDelegate;

  public constructor(
    publicSet: ObservablePublicSet,
    addVocabularyDelegate: AddVocabularyDelegate,
    publicVocabularyActionMenuDelegate: PublicVocabularyActionMenuDelegate,
    dialogDelegate: DialogDelegate,
  ) {
    this.publicSet = publicSet;
    this.addVocabularyDelegate = addVocabularyDelegate;
    this.publicVocabularyActionMenuDelegate = publicVocabularyActionMenuDelegate;
    this.dialogDelegate = dialogDelegate;
  }

  public addVocabulary(
    publicVocabulary: PublicVocabulary,
    checkDuplicate: boolean = true,
  ): void {
    this.addVocabularyDelegate.addVocabularyFromPublicVocabulary(
      publicVocabulary,
      this.publicSet.title,
      checkDuplicate,
      {
        onAdding: this.showAddingDialog,
        onAddSucceeded: this.showAddSucceededDialog,
        onAddFailed: (errorBag): void => {
          this.showAddFailedDialogWithRetry(
            errorBag,
            (shouldCheckDuplicate: boolean): void => {
              this.addVocabulary(publicVocabulary, shouldCheckDuplicate);
            },
          );
        },
      },
    );
  }

  public showAddAllDialog(ignoreDuplicates: boolean = true): void {
    this.dialogDelegate.show({
      message: ignoreDuplicates
        ? 'This will prevent adding duplicates (only new terms will be added). Do you want to continue?'
        : 'Do you want to add all terms?',
      closeOnTouchOutside: true,
      onBackgroundPress: (): void => {
        this.dialogDelegate.dismiss();
      },
      buttonList: [
        {
          testID: PublicSetDetailScreenIds.CANCEL_BTN,
          text: 'NO',
          onPress: (): void => {
            this.dialogDelegate.dismiss();
          },
          styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
        {
          testID: PublicSetDetailScreenIds.CONFIRM_ADD_ALL_BTN,
          text: 'YES',
          onPress: (): void => {
            // Show adding dialog first
            this.showAddingDialog();

            _.delay((): void => {
              this.addVocabularyDelegate.addVocabularyFromPublicVocabularyList(
                this.publicSet.vocabularyList,
                this.publicSet.title,
                true,
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
    });
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
    this.dialogDelegate.show({
      message: 'Adding vocabulary. Please wait...',
    });
  }

  private showAddSucceededDialog(): void {
    this.dialogDelegate.showSuccessDialog({
      message: 'Added successfully.',
    });
  }

  private showAddFailedDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag, {
      title: 'ADD FAILED',
    });
  }

  private showAddFailedDialogWithRetry(
    errorBag: ErrorBag,
    retry: (checkDuplicate: boolean) => void,
  ): void {
    if (errorBag.errorCode === ErrorCode.VOCABULARY__DUPLICATE_TERM) {
      this.dialogDelegate.show({
        testID: LightBoxDialogIds.SUCCESS_DIALOG,
        message:
          'You have added this term before. Do you want to add it again?',
        onBackgroundPress: (): void => {
          this.dialogDelegate.dismiss();
        },
        buttonList: [
          {
            testID: LightBoxDialogIds.CANCEL_BTN,
            text: 'NO',
            onPress: (): void => {
              this.dialogDelegate.dismiss();
            },
            styles: FullRoundedButtonStyle.getFullPrimaryBackgroundStyles(
              ButtonSize.SMALL,
            ),
          },
          {
            testID: LightBoxDialogIds.OKAY_BTN,
            text: 'YES',
            onPress: (): void => {
              retry(false);
            },
            styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
              ButtonSize.SMALL,
            ),
          },
        ],
      });
    } else {
      this.dialogDelegate.showFailedDialog(errorBag, {
        title: 'ADD FAILED',
      });
    }
  }
}
