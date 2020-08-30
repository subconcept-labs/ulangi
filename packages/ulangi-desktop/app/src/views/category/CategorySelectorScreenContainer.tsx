import * as React from "react"
import { Container } from "../../Container"
import { observer } from "mobx-react"

export interface CategorySelectorScreenPassedProps {
  screenTitle: string;
  initialCategoryName?: string;
  onSelect: (categoryName: string) => void;
}

@observer
export class CategorySelectorScreenContainer extends Container<CategorySelectorScreenPassedProps> {

  public render(): React.ReactElement {
    return <div />
  }
}
