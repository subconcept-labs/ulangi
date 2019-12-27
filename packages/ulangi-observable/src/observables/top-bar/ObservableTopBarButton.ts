import { observable } from 'mobx';

export class ObservableTopBarButton {
  @observable
  public testID: string;

  @observable
  public text: null | string;

  @observable
  public icon: null | {
    light: any;
    dark: any;
  };

  @observable
  public onPress: Function;

  public constructor(
    testID: string,
    text: null | string,
    icon: null | {
      light: any;
      dark: any;
    },
    onPress: Function
  ) {
    this.testID = testID;
    this.text = text;
    this.icon = icon;
    this.onPress = onPress;
  }
}
