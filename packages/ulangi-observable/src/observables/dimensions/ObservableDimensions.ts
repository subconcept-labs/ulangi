import { computed, observable } from 'mobx';

export class ObservableDimensions {
  @observable
  public screenWidth: number;

  @observable
  public screenHeight: number;

  @observable
  public windowWidth: number;

  @observable
  public windowHeight: number;

  @computed
  public get isPortrait(): boolean {
    return this.screenHeight >= this.screenWidth;
  }

  @computed
  public get isLandscape(): boolean {
    return this.screenHeight < this.screenWidth;
  }

  public constructor(
    screenWidth: number,
    screenHeight: number,
    windowWidth: number,
    windowHeight: number
  ) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
  }
}
