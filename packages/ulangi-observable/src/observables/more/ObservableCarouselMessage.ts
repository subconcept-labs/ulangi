/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observable } from 'mobx';

export class ObservableCarouselMessage {
  @observable
  public messageId: string;

  @observable
  public title: string;

  @observable
  public message: string;

  @observable
  public backgroundColor: string;

  @observable
  public buttonText: string;

  @observable
  public buttonTextColor: string;

  @observable
  public onPress: () => void;

  public constructor(
    messageId: string,
    title: string,
    message: string,
    backgroundColor: string,
    buttonText: string,
    buttonTextColor: string,
    onPress: () => void
  ) {
    this.messageId = messageId;
    this.title = title;
    this.message = message;
    this.backgroundColor = backgroundColor;
    this.buttonText = buttonText;
    this.buttonTextColor = buttonTextColor;
    this.onPress = onPress;
  }
}
