import * as React from "react"
import { observer } from "mobx-react"
import { ChartContainer, RowContainer, Level, Count, CountContainer, Percentage } from "./LevelBreakdown.style"
import { LevelSingleBar } from "./LevelSingleBar"
import { config } from "../../constants/config"

export interface LevelBreakdownProps {
  levelCounts: {
    totalCount: number;
    level0Count: number,
    level1To3Count: number,
    level4To6Count: number,
    level7To8Count: number,
    level9To10Count: number,
  }
}

export const LevelBreakdown = observer((props: LevelBreakdownProps): React.ReactElement => {
  const countPerLevelPairs: [ string, number ][] = [
    ['Level\n0', props.levelCounts.level0Count],
    ['Level\n1-3', props.levelCounts.level1To3Count],
    ['Level\n4-6', props.levelCounts.level4To6Count],
    ['Level\n7-8', props.levelCounts.level7To8Count],
    ['Level\n9-10', props.levelCounts.level9To10Count],
  ]

  return (
    <ChartContainer>
      {countPerLevelPairs.map(
        ([level, count], index): React.ReactElement<any> => {
          const percentage = count / props.levelCounts.totalCount;
          return (
            <RowContainer key={level}>
              <Level>{level}</Level>
              <LevelSingleBar
                color={config.level.colorMap[index]}
                percentage={percentage}
              />
              <CountContainer>
                <Count>{count}</Count>
                <Percentage>
                  {Math.round(percentage * 100)}%
                </Percentage>
              </CountContainer>
            </RowContainer>
          );
        },
      )}
    </ChartContainer>
  )
})
