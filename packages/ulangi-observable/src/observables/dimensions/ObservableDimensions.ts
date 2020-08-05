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
    return this.windowHeight >= this.windowWidth;
  }

  @computed
  public get isLandscape(): boolean {
    return this.windowHeight < this.windowWidth;
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
