import * as React from "react"
import { ButtonSize } from "@ulangi/ulangi-common/enums"
import { observer } from "mobx-react"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Button } from "../common/Button";
import { roundedCornerButtonStyles } from "../../styles/RoundedCornerButtonStyles"

export interface CategoryBulkActionMenuButtonProps {
  selectAll?: () => void;
  recategorizeSelected?: () => void;
  moveSelected?: () => void;
  restoreSelected?: () => void;
  archiveSelected?: () => void;
  deleteSelected?: () => void;
  reviewBySpacedRepetition?: () => void;
  reviewByWriting?: () => void;
  quiz?: () => void;
  playReflex?: () => void;
  playAtom?: () => void;
}

export const CategoryBulkActionMenuButton = observer((props: CategoryBulkActionMenuButtonProps): React.ReactElement => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const showMenu = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const id = 'category-bulk-action-menu'

  const items = []

  if (typeof props.selectAll !== 'undefined'){
    items.push({ text: 'Select all fetched categories', onPress: props.selectAll })
  }

  if (typeof props.recategorizeSelected !== 'undefined') {
    items.push({ text: "Recategorize selected", onPress: props.recategorizeSelected })
  }

  if (typeof props.moveSelected !== 'undefined') {
    items.push({ text: "Move selected", onPress: props.moveSelected })
  }

  if (typeof props.restoreSelected !== 'undefined') {
    items.push({ text: "Restore selected", onPress: props.restoreSelected })
  }

  if (typeof props.archiveSelected !== 'undefined') {
    items.push({ text: "Archive selected", onPress: props.archiveSelected })
  }

  if (typeof props.deleteSelected !== 'undefined') {
    items.push({ text: "Delete selected", onPress: props.deleteSelected })
  }

  if (typeof props.reviewBySpacedRepetition !== 'undefined') {
    items.push({ text: "Review by Spaced Repetition", onPress: props.reviewBySpacedRepetition })
  }

  if (typeof props.reviewByWriting !== 'undefined') {
    items.push({ text: "Review by Writing", onPress: props.reviewByWriting })
  }

  if (typeof props.quiz !== 'undefined') {
    items.push({ text: "Quiz", onPress: props.quiz })
  }

  if (typeof props.playReflex !== 'undefined') {
    items.push({ text: "Play Reflex", onPress: props.playReflex })
  }

  if (typeof props.playAtom !== 'undefined') {
    items.push({ text: "Play Atom", onPress: props.playAtom })
  }

  return (
    <>
      <Button
        styles={roundedCornerButtonStyles.getSolidBackgroundStyles(
          ButtonSize.SMALL,
          '4px',
          '#fff',
          "#666"
        )}
        onClick={showMenu}
        text="Perform action"
      />
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        {
          items.map((item): React.ReactElement => (
            <MenuItem 
              key={item.text}
              onClick={
                (): void => {
                  closeMenu()
                  item.onPress()
                }
              }
            >{item.text}</MenuItem>
          ))
        }
      </Menu>
    </>
  )
})
