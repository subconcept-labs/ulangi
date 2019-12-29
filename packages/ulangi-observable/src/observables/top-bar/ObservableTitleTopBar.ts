import { observable } from 'mobx';

import { ObservableTopBarButton } from './ObservableTopBarButton';

export class ObservableTitleTopBar {
  public readonly kind: 'title' = 'title';

  @observable
  public title: string;

  @observable
  public leftButton: null | ObservableTopBarButton;

  @observable
  public rightButton: null | ObservableTopBarButton;

  public constructor(
    title: string,
    leftButton: null | ObservableTopBarButton,
    rightButton: null | ObservableTopBarButton
  ) {
    this.title = title;
    this.leftButton = leftButton;
    this.rightButton = rightButton;
  }
}
