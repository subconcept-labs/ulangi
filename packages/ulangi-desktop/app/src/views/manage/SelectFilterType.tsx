import FormControl from '@material-ui/core/FormControl';
import { VocabularyStatus } from "@ulangi/ulangi-common/enums"
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import * as _ from 'lodash';
import * as React from 'react';

export interface SelectFilterTypeProps {
  selectedFilterType: VocabularyStatus;
  selectFilterType: (vocabularyStatus: VocabularyStatus) => void;
}

export const SelectFilterType = (
  props: SelectFilterTypeProps,
): React.ReactElement => (
  <FormControl>
    <InputLabel id="select-filter-type-label">Status</InputLabel>
    <Select
      labelId="select-filter-type-label"
      id="select-filter-type"
      value={props.selectedFilterType}
      onChange={(event): void => props.selectFilterType(event.target.value as VocabularyStatus)}>
      <MenuItem value={VocabularyStatus.ACTIVE}>Active</MenuItem>
      <MenuItem value={VocabularyStatus.ARCHIVED}>Archived</MenuItem>
      <MenuItem value={VocabularyStatus.DELETED}>Deleted</MenuItem>
    </Select>
  </FormControl>
);
