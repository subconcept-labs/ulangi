import { IObservableArray, observable } from 'mobx';

export class ObservableSuggestion {
  @observable
  public importance: 'RECOMMENDED' | 'OPTIONAL';

  @observable
  public message: string;

  @observable
  public buttons: IObservableArray<{
    text: string;
    onPress: () => void;
  }>;

  public constructor(
    importance: 'RECOMMENDED' | 'OPTIONAL',
    message: string,
    buttons: IObservableArray<{
      text: string;
      onPress: () => void;
    }>
  ) {
    this.importance = importance;
    this.message = message;
    this.buttons = buttons;
  }
}
