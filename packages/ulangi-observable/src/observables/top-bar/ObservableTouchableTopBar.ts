import { observable } from 'mobx';

import { ObservableTopBarButton } from './ObservableTopBarButton';

export class ObservableTouchableTopBar {
  public readonly kind: 'touchable' = 'touchable';

  @observable
  public testID: string;

  @observable
  public text: string;

  @observable
  public icon: null | string;

  @observable
  public onPress: Function;

  @observable
  public leftButton: null | ObservableTopBarButton;

  @observable
  public rightButton: null | ObservableTopBarButton;

  public constructor(
    testID: string,
    text: string,
    icon: null | string,
    onPress: Function,
    leftButton: null | ObservableTopBarButton,
    rightButton: null | ObservableTopBarButton
  ) {
    this.testID = testID;
    this.text = text;
    this.icon = icon;
    this.onPress = onPress;
    this.leftButton = leftButton;
    this.rightButton = rightButton;
  }
}
