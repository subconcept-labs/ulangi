import * as React from "react"
import { observer } from "mobx-react"
import { ObservableLightBox } from "@ulangi/ulangi-observable"
import { LightBoxTouchableBackground } from "../light-box/LightBoxTouchableBackground"
import { LightBoxAnimatableView } from "../light-box/LightBoxAnimatableView"
import { LevelBreakdown } from "./LevelBreakdown"
import { Wrapper, Screen, TitleContainer, Title } from "./LevelBreakdownScreen.style"
import { ScrollableView } from "../common/ScrollableView"

export interface LevelBreakdownScreenProps {
  observableLightBox: ObservableLightBox
  close: () => void;
  levelCounts: {
    readonly totalCount: number;
    readonly level0Count: number;
    readonly level1To3Count: number;
    readonly level4To6Count: number;
    readonly level7To8Count: number;
    readonly level9To10Count: number;
  };
}

export const LevelBreakdownScreen = observer((props: LevelBreakdownScreenProps): React.ReactElement => (
  <Screen>
    <LightBoxTouchableBackground
      enabled={true}
      style={{ padding: "120px 16px" }}
      onPress={props.close}>
      <LightBoxAnimatableView>
        <Wrapper>
          <TitleContainer>
            <Title>Level Breakdown</Title>
          </TitleContainer>
          <ScrollableView>
            <LevelBreakdown levelCounts={props.levelCounts} />
          </ScrollableView>
        </Wrapper>
      </LightBoxAnimatableView>
    </LightBoxTouchableBackground>
  </Screen>
))
