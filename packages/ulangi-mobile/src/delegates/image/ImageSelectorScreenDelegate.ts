/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ErrorBag, PixabayImage } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableImageSelectorScreen,
  ObservableLightBox,
  ObservablePixabayImage,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { when } from 'mobx';

import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { SearchImageDelegate } from './SearchImageDelegate';
import { UploadImageDelegate } from './UploadImageDelegate';

@boundClass
export class ImageSelectorScreenDelegate {
  private observableLightBox: ObservableLightBox;
  private observableScreen: ObservableImageSelectorScreen;
  private searchImageDelegate: SearchImageDelegate;
  private uploadImageDelegate: UploadImageDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableLightBox: ObservableLightBox,
    observableScreen: ObservableImageSelectorScreen,
    searchImageDelegate: SearchImageDelegate,
    uploadImageDelegate: UploadImageDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observableLightBox = observableLightBox;
    this.observableScreen = observableScreen;
    this.searchImageDelegate = searchImageDelegate;
    this.uploadImageDelegate = uploadImageDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public prepareAndSearch(): void {
    this.searchImageDelegate.prepareAndSearch();
  }

  public search(): void {
    this.searchImageDelegate.search();
  }

  public clearSearch(): void {
    this.searchImageDelegate.clearSearch();
  }

  public resetSearch(): void {
    this.searchImageDelegate.resetSearch();
  }

  public toggleSelect(image: ObservablePixabayImage): void {
    image.isSelected.set(!image.isSelected.get());
  }

  public uploadImages(callback: (urls: string[]) => void): void {
    if (this.observableScreen.images === null) {
      this.navigatorDelegate.dismissScreen();
    } else {
      this.uploadImageDelegate.uploadImages(
        this.observableScreen.images
          .filter(
            (image): boolean => {
              return image.isSelected.get();
            },
          )
          .map(
            (image): PixabayImage => {
              return image.toRaw();
            },
          ),
        {
          onUploading: this.showUploading,
          onUploadSucceeded: (urls): void => {
            this.dialogDelegate.dismiss();
            when(
              (): boolean => this.observableLightBox.state === 'unmounted',
              (): void => {
                this.navigatorDelegate.dismissScreen();
                callback(urls);
              },
            );
          },
          onUploadFailed: this.showUploadFailed,
        },
      );
    }
  }

  public showPixabayWebsite(): void {
    this.navigatorDelegate.showModal(ScreenName.BROWSER_SCREEN, {
      link: 'https://pixabay.com',
      screenTitle: 'Pixabay',
    });
  }

  private showUploading(): void {
    this.dialogDelegate.show({
      message: 'Processing images...',
      closeOnTouchOutside: false,
      showCloseButton: false,
    });
  }

  private showUploadFailed(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag);
  }
}
