import { computed, observable, IObservableArray } from "mobx"

import { ObservableNavigationComponent } from "./ObservableNavigationComponent"

export class ObservableNavigationTabBasedComponent extends ObservableNavigationComponent {

  @observable
  public selectableComponents: IObservableArray<ObservableNavigationComponent>

  @observable
  public selectedComponentIndex: number

  @computed
  public get selectedComponent(): undefined | ObservableNavigationComponent {
    return this.selectableComponents[this.selectedComponentIndex]
  }

  public constructor(
    componentId: string,
    passedProps: object,
    selectableComponents: IObservableArray<ObservableNavigationComponent>,
    selectedComponentIndex: number
  ) {
    super(componentId, passedProps)
    this.selectableComponents = selectableComponents
    this.selectedComponentIndex = selectedComponentIndex
  }
}
