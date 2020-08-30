import { observer } from "mobx-react"
import * as React from "react"
import { Container, Part } from "./LevelSingleBar.style"

export interface LevelSingleBarProps {
  color: string,
  percentage: number
}

export const LevelSingleBar = observer((props: LevelSingleBarProps): React.ReactElement => (
  <Container>
    <Part style={{ backgroundColor: props.color, flex: props.percentage }} />
    <Part style={{ flex: 1 - props.percentage }} />
  </Container>
))
