import * as React from "react"
import { observer } from "mobx-react"
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Images } from "../../constants/Images";
import { ObservableCategory } from "@ulangi/ulangi-observable"

export interface CategoryActionMenuButtonProps {
  category: ObservableCategory,
  select?: () => void;
  unselect?: () => void;
  viewDetail?: () => void;
  addTerms?: () => void;
  recategorize?: () => void;
  move?: () => void;
  restore?: () => void;
  archive?: () => void;
  delete?: () => void;
  reviewBySpacedRepetition?: () => void;
  reviewByWriting?: () => void;
  quiz?: () => void;
  playReflex?: () => void;
  playAtom?: () => void;
}

export const CategoryActionMenuButton = observer((props: CategoryActionMenuButtonProps): React.ReactElement => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const showMenu = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const categoryName = props.category.categoryName

  const id = 'category-action-menu-' + categoryName

  const items = []

  if (typeof props.select !== 'undefined'){
    items.push({ text: 'Select', onPress: props.select })
  }

  if (typeof props.unselect !== 'undefined'){
    items.push({ text: 'Unselect', onPress: props.unselect })
  }

  if (typeof props.viewDetail !== 'undefined') {
    items.push({ text: 'View detail', onPress: props.viewDetail })
  }

  if (typeof props.addTerms !== 'undefined') {
    items.push({ text: 'Add terms', onPress: props.addTerms })
  }

  if (typeof props.recategorize !== 'undefined') {
    items.push({ text: "Recategorize/Rename", onPress: props.recategorize })
  }

  if (typeof props.move !== 'undefined') {
    items.push({ text: "Move", onPress: props.move })
  }

  if (typeof props.restore !== 'undefined') {
    items.push({ text: "Restore", onPress: props.restore })
  }

  if (typeof props.archive !== 'undefined') {
    items.push({ text: "Archive", onPress: props.archive })
  }

  if (typeof props.delete !== 'undefined') {
    items.push({ text: "Delete", onPress: props.delete })
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
      <Button aria-controls={id} aria-haspopup="true" onClick={showMenu}>
        <img src={Images.HORIZONTAL_DOTS_GREY_22X22} />
      </Button>
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
