import * as React from 'react';

import { Images } from '../../constants/Images';
import { DefaultButton } from '../common/DefaultButton';

export interface SearchButtonProps {
  search: () => void;
}

export const SearchButton = (props: SearchButtonProps): React.ReactElement => (
  <DefaultButton onClick={props.search}>
    <img src={Images.SEARCH_GREY_18X18} />
  </DefaultButton>
);
