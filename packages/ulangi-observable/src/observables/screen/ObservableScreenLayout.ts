import { action, computed, observable } from 'mobx';

export class ObservableScreenLayout {
  @observable
  public width: number;

  @observable
  public height: number;

  @computed
  public get isPortrait(): boolean {
    return this.height >= this.width;
  }

  @computed
  public get isLandscape(): boolean {
    return this.height < this.width;
  }

  @action
  public update(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
