import * as React from "react"
import { ButtonSize, VocabularyStatus } from "@ulangi/ulangi-common/enums"
import { observer } from "mobx-react"
import { Container, SelectionText, NumberOfSelected, ButtonList, ButtonContainer } from "./CategoryBulkActionBar.style"
import { ObservableCategoryListState } from "@ulangi/ulangi-observable"
import { Button } from "../common/Button"
import { roundedCornerButtonStyles } from "../../styles/RoundedCornerButtonStyles"
import { CategoryBulkActionMenuButton } from "./CategoryBulkActionMenuButton"

export interface CategoryBulkActionBarProps {
  categoryListState: ObservableCategoryListState
  selectedVocabularyStatus: VocabularyStatus

  clearSelections: () => void
  selectAll: () => void;
  recategorize: (categoryNames: string[], vocabularyStatus: VocabularyStatus) => void;
  move: (categoryNames: string[], vocabularyStatus: VocabularyStatus) => void;
  restore: (categoryNames: string[], vocabularyStatus: VocabularyStatus) => void;
  archive: (categoryNames: string[], vocabularyStatus: VocabularyStatus) => void;
  delete: (categoryNames: string[], vocabularyStatus: VocabularyStatus) => void;
  reviewBySpacedRepetition: (categoryNames: string[]) => void;
  reviewByWriting: (categoryNames: string[]) => void;
  quiz: (categoryNames: string[]) => void;
  playReflex: (categoryNames: string[]) => void;
  playAtom: (categoryNames: string[]) => void;
}

export const CategoryBulkActionBar = observer((props: CategoryBulkActionBarProps): React.ReactElement => (
  <Container>
    <SelectionText>
      <NumberOfSelected>
        {props.categoryListState.numOfCategoriesSelected}
      </NumberOfSelected>
      {' '}
      {props.categoryListState.numOfCategoriesSelected === 1
        ? 'category'
        : 'categories'}{' '}
      selected
    </SelectionText>
    <ButtonList>
      <ButtonContainer>
        <Button 
          styles={roundedCornerButtonStyles.getSolidBackgroundStyles(
            ButtonSize.SMALL,
            '4px',
            '#fff',
            "#666"
          )}
          onClick={props.clearSelections}
          text="Clear"
        />
      </ButtonContainer>
      <ButtonContainer>
        <CategoryBulkActionMenuButton 
          selectAll={props.selectAll}
          recategorizeSelected={(): void => props.recategorize(
            props.categoryListState.selectedCategoryNames,
            props.selectedVocabularyStatus
          )}
          moveSelected={(): void => props.move(
            props.categoryListState.selectedCategoryNames,
            props.selectedVocabularyStatus
          )}
          restoreSelected={(): void => props.restore(
            props.categoryListState.selectedCategoryNames,
            props.selectedVocabularyStatus
          )}
          archiveSelected={(): void => props.archive(
            props.categoryListState.selectedCategoryNames,
            props.selectedVocabularyStatus
          )}
          deleteSelected={(): void => props.delete(
            props.categoryListState.selectedCategoryNames,
            props.selectedVocabularyStatus
          )}
          reviewBySpacedRepetition={(): void => props.reviewBySpacedRepetition(
            props.categoryListState.selectedCategoryNames,
          )}
          reviewByWriting={(): void => props.reviewByWriting(
            props.categoryListState.selectedCategoryNames,
          )}
          quiz={(): void => props.quiz(
            props.categoryListState.selectedCategoryNames,
          )}
          playReflex={(): void => props.playReflex(
            props.categoryListState.selectedCategoryNames,
          )}
          playAtom={(): void => props.playAtom(
            props.categoryListState.selectedCategoryNames,
          )}
        />
      </ButtonContainer>
    </ButtonList>
  </Container>
))
