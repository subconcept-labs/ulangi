import CircularProgress from '@material-ui/core/CircularProgress';
import { Theme } from '@ulangi/ulangi-common/enums';
import * as React from 'react';
import { ThemeContext } from 'styled-components';

import { config } from '../../constants/config';

export interface SpinnerProps {
  theme?: Theme;
  size?: 'large' | 'normal' | 'small';
}

export const Spinner = (props: SpinnerProps): React.ReactElement => {
  const theme = props.theme ? props.theme : React.useContext(ThemeContext).name;
  const color = theme === Theme.LIGHT ? config.styles.primaryColor : '#fff';

  const size = props.size === 'large' ? 60 : props.size === 'normal' ? 48 : 28;

  return <CircularProgress size={size} style={{ color }} />;
};
