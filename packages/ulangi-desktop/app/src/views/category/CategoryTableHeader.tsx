import * as React from "react"
import { observer } from "mobx-react"
import { ObservableCategoryListState } from "@ulangi/ulangi-observable"
import { RowContainer, CheckBoxContainer, CategoryNameContainer, CountContainer, SpacedRepetitionProgressContainer, WritingProgressContainer, ActionButtonContainer } from "./CategoryRow.style"
import { HeaderTitle } from "./CategoryTableHeader.style"
import { Images } from "../../constants/Images"
import Checkbox from '@material-ui/core/Checkbox';

export interface CategoryTableHeaderProps {
  categoryListState: ObservableCategoryListState
  selectAll: () => void;
  clearAll: () => void;
}

export const CategoryTableHeader = observer((props: CategoryTableHeaderProps): React.ReactElement => {
  const cellStyle = {
    backgroundColor: "#f7f7f7",
    borderTopWidth: '0px',
    borderBottomWidth: '1px',
  }

  return (
    <RowContainer style={{ position: 'sticky', top: 0, zIndex: 1 }}>
      <CheckBoxContainer style={cellStyle}>
        <Checkbox
          checked={props.categoryListState.areAllSelected}
          indeterminate={props.categoryListState.isPartiallySelected}
          icon={<img src={Images.CHECKBOX_UNCHECKED_GREY_18X18} />}
          checkedIcon={<img src={Images.CHECKBOX_CHECKED_PRIMARY_18X18} />}
          indeterminateIcon={<img src={Images.CHECKBOX_INDETERMINATE_PRIMARY_18X18} />}
          onChange={(event): void => {
            if (event.target.checked) {
              props.selectAll()
            } else {
              props.clearAll()
            }
          }}
        />
      </CheckBoxContainer>
      <CategoryNameContainer style={cellStyle}>
        <HeaderTitle>Category</HeaderTitle>
      </CategoryNameContainer>
      <CountContainer style={cellStyle}>
        <HeaderTitle>Count</HeaderTitle>
      </CountContainer>
      <SpacedRepetitionProgressContainer style={cellStyle}>
        <HeaderTitle>Spaced Repetition</HeaderTitle>
      </SpacedRepetitionProgressContainer>
      <WritingProgressContainer style={cellStyle}>
        <HeaderTitle>Writing</HeaderTitle>
      </WritingProgressContainer>
      <ActionButtonContainer style={cellStyle}>
        <HeaderTitle>Action</HeaderTitle>
      </ActionButtonContainer>
    </RowContainer>
  )
})
