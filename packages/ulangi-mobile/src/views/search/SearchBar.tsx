/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableSearchScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { SearchInput } from '../../views/search/SearchInput';
import { TopBar } from '../common/TopBar';

export interface SearchBarProps {
  theme: Theme;
  observableScreen: ObservableSearchScreen;
  handleSearchInputEnd: () => void;
}

@observer
export class SearchBar extends React.Component<SearchBarProps> {
  public render(): React.ReactElement<any> {
    return (
      <TopBar theme={this.props.theme}>
        <SearchInput
          theme={this.props.theme}
          observableScreen={this.props.observableScreen}
          submit={this.props.handleSearchInputEnd}
        />
      </TopBar>
    );
  }
}
