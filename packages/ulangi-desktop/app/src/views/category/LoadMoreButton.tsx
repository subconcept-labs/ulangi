import * as React from "react"
import { observer } from "mobx-react"
import { ButtonSize } from "@ulangi/ulangi-common/enums"
import { Button } from "../common/Button"
import { fullRoundedButtonStyles } from "../../styles/FullRoundedButtonStyles"

export interface LoadMoreButtonProps {
  fetchNext(): void
}

export const LoadMoreButton = observer((props: LoadMoreButtonProps): React.ReactElement => (
  <Button
    onClick={props.fetchNext}
    styles={
      fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
        ButtonSize.NORMAL
      )
    }
    text="Load more"
  />
))
