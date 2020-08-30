import { observable } from "mobx"

export class ObservableNavigationComponent {
  @observable
  public componentId: string

  @observable
  public passedProps: object

  @observable
  public componentName?: string;

  @observable
  public componentIcon?: any;

  public constructor(
    componentId: string,
    passedProps: object,
    componentName?: string,
    componentIcon?: string
  ) {
    this.componentId = componentId
    this.passedProps = passedProps
    this.componentName = componentName
    this.componentIcon = componentIcon
  }
}
