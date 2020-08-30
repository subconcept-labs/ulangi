import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import * as _ from 'lodash';
import * as React from 'react';

export interface SelectLayoutProps {
  selectedLayout: 'table' | 'list';
  selectLayout: (layout: 'table' | 'list') => void;
}

export const SelectLayout = (
  props: SelectLayoutProps,
): React.ReactElement => (
  <FormControl>
    <InputLabel id="select-layout-label">Layout</InputLabel>
    <Select
      labelId="select-layout-label"
      id="select-layout"
      value={props.selectedLayout}
      onChange={(event): void => props.selectLayout(event.target.value as 'table' | 'list')}>
      <MenuItem value={'table'}>Table</MenuItem>
      <MenuItem value={'list'}>List</MenuItem>
    </Select>
  </FormControl>
);
