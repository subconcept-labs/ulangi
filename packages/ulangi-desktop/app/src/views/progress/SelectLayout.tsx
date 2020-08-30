import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { observer } from 'mobx-react';
import * as React from 'react';

export interface SelectLayoutProps {
  layout: 'continuous' | 'month-by-month';
  setLayout: (layout: 'continuous' | 'month-by-month') => void;
}

export const SelectLayout = observer(
  (props: SelectLayoutProps): React.ReactElement => {
    return (
      <FormControl>
        <InputLabel id="select-layout-label">Layout</InputLabel>
        <Select
          labelId="select-layout-label"
          id="select-layout"
          value={props.layout}
          onChange={(event): void =>
            props.setLayout(event.target.value as
              | 'continuous'
              | 'month-by-month')
          }>
          <MenuItem value="month-by-month">Month-by-month</MenuItem>
          <MenuItem value="continuous">Continuous</MenuItem>
        </Select>
      </FormControl>
    );
  },
);
