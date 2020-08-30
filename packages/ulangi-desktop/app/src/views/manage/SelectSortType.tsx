import FormControl from '@material-ui/core/FormControl';
import { CategorySortType } from "@ulangi/ulangi-common/enums";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import * as _ from 'lodash';
import * as React from 'react';

export interface SelectSortTypeProps {
  selectedSortType: CategorySortType
  selectSortType: (sortType: CategorySortType) => void
}

export const SelectSortType = (
  props: SelectSortTypeProps,
): React.ReactElement => (
  <FormControl>
    <InputLabel id="select-sort-type-label">Sort by</InputLabel>
    <Select
      labelId="select-sort-type-label"
      id="select-sort-type"
      value={props.selectedSortType}
      onChange={(event): void => props.selectSortType(event.target.value as CategorySortType)}>
      <MenuItem 
        value={CategorySortType.SORT_BY_NAME_ASC}>
        Sort by category (A-Z)
      </MenuItem>
      <MenuItem 
        value={CategorySortType.SORT_BY_NAME_DESC}>
        Sort by category (Z-A)
      </MenuItem>
      <MenuItem 
        value={CategorySortType.SORT_BY_COUNT_ASC}>
        Sort by count (ASC)
      </MenuItem>
      <MenuItem 
        value={CategorySortType.SORT_BY_COUNT_DESC}>
        Sort by count (DESC)
      </MenuItem>
    </Select>
  </FormControl>
);
