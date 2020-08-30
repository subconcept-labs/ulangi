import * as React from 'react';
import * as numeral from "numeral"

import { Count, CountContainer } from './DueAndNewCounts.style';

export interface DueAndNewCountProps {
  counts: {
    due: number;
    new: number;
  };
}

export const DueAndNewCount = (
  props: DueAndNewCountProps,
): React.ReactElement => {
  const highlightedCount = {
    //fontWeight: 700,
    color: '#4fa954',
  };

  return (
    <CountContainer>
      <Count style={props.counts.due > 0 ? highlightedCount : {}}>
        {numeral(props.counts.due).format('0a')} due
      </Count>
      <Count style={props.counts.new > 0 ? highlightedCount : {}}>
        {numeral(props.counts.new).format('0a')} new
      </Count>
    </CountContainer>
  );
};
