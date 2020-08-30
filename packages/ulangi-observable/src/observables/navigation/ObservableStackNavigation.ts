import { computed, observable, IObservableArray } from "mobx"
import { ObservableNavigationComponent } from "./ObservableNavigationComponent"
import { ObservableNavigationTabBasedComponent } from "./ObservableNavigationTabBasedComponent"
import * as _ from "lodash"

export class ObservableStackNavigation {

  @observable
  public components: IObservableArray<
    | ObservableNavigationComponent 
    | ObservableNavigationTabBasedComponent
  >

  @observable
  public lightBox: null | ObservableNavigationComponent

  @computed
  public get currentActiveComponent(): undefined | ObservableNavigationComponent {
    const lastComponent = _.last(this.components)
    if (typeof lastComponent !== 'undefined') {
      if (this.isTabBasedComponent(lastComponent)) {
        return lastComponent.selectedComponent
      } else {
        return lastComponent
      }
    } else {
      return undefined
    }
  }

  @computed
  public get currentActiveComponentId(): undefined | string {
    return typeof this.currentActiveComponent !== 'undefined'
      ? this.currentActiveComponent.componentId
      : undefined
  }

  public isTabBasedComponent(component: ObservableNavigationComponent | ObservableNavigationTabBasedComponent): component is ObservableNavigationTabBasedComponent {
    return _.has(component, "selectableComponents");
  }

  public getComponentById(componentId: string): undefined | ObservableNavigationComponent  {
    return this.components.find((component): boolean => {
      return component.componentId === componentId
    })
  }

  public contains(componentId: string): boolean {
    return typeof this.getComponentById(componentId) !== 'undefined'
  }

  public constructor(
    components: IObservableArray<ObservableNavigationComponent>,
    lightBox: null | ObservableNavigationComponent,
  ) {
    this.components = components
    this.lightBox = lightBox
  }
}
