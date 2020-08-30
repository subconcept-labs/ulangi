import * as React from "react"
import { Container } from "../../Container"
import { observer } from "mobx-react"
import { ObservableScreen } from "@ulangi/ulangi-observable"
import { ScreenFactory } from "../../factories/ScreenFactory"
import { ScreenName } from "@ulangi/ulangi-common/enums"
import { LevelBreakdownScreen } from "../level/LevelBreakdownScreen"

export interface LevelBreakdownScreenPassedProps {
  readonly levelCounts: {
    readonly totalCount: number;
    readonly level0Count: number;
    readonly level1To3Count: number;
    readonly level4To6Count: number;
    readonly level7To8Count: number;
    readonly level9To10Count: number;
  };
}

@observer
export class LevelBreakdownScreenContainer extends Container<
  LevelBreakdownScreenPassedProps
> {
  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.LEVEL_BREAKDOWN_SCREEN,
    null,
  );

  private screenFactory = new ScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  public render(): React.ReactElement<any> {
    return (
      <LevelBreakdownScreen
        observableLightBox={this.observableLightBox}
        levelCounts={this.props.passedProps.levelCounts}
        close={(): void => this.navigatorDelegate.dismissLightBox()}
      />
    );
  }
}
