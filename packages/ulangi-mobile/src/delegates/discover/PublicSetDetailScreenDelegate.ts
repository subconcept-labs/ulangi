/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize } from '@ulangi/ulangi-common/enums';
import { ErrorBag, PublicVocabulary } from '@ulangi/ulangi-common/interfaces';
import { ObservablePublicSet } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import * as _ from 'lodash';
import { Linking } from 'react-native';

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
    this.dialogDelegate.show({
      message: 'Are you sure you want to add all the terms?',
      closeOnTouchOutside: true,
      onBackgroundPress: (): void => {
        this.dialogDelegate.dismiss();
      },
      buttonList: [
        {
          testID: PublicSetDetailScreenIds.CANCEL_BTN,
          text: 'CANCEL',
          onPress: (): void => {
            this.dialogDelegate.dismiss();
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
}
