import { observable } from "mobx"
import { ObservableStackNavigation } from "./ObservableStackNavigation"
import * as _ from "lodash"

export class ObservableRootNavigation {

  @observable
  public stack: ObservableStackNavigation

  public constructor(
    stack: ObservableStackNavigation
  ) {
    this.stack = stack
  }

}
