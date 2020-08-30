import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import * as _ from 'lodash';
import * as React from 'react';

export interface SelectYearProps {
  year: number;
}

export const SelectYear = (props: SelectYearProps): React.ReactElement => {
  return (
    <FormControl>
      <InputLabel id="select-year-label">Year</InputLabel>
      <Select
        labelId="select-year-label"
        id="select-year"
        value={props.year}
        onChange={_.noop}>
        <MenuItem value={props.year}>{props.year}</MenuItem>
      </Select>
    </FormControl>
  );
};
