/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableCategorizeScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { CategorizeScreenIds } from '../../constants/ids/CategorizeScreenIds';
import { CategorizeScreenDelegate } from '../../delegates/category/CategorizeScreenDelegate';
import { CategoryForm } from './CategoryForm';

export interface CategorizeScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableCategorizeScreen;
  screenDelegate: CategorizeScreenDelegate;
}

@observer
export class CategorizeScreen extends React.Component<CategorizeScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={CategorizeScreenIds.SCREEN}>
        <CategoryForm
          theme={this.props.themeStore.theme}
          categoryFormState={this.props.observableScreen.categoryFormState}
          setCategoryName={this.props.screenDelegate.setCategoryName}
          fetchCategorySuggestions={
            this.props.screenDelegate.fetchCategorySuggestions
          }
          showAllCategories={this.props.screenDelegate.showAllCategories}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
