/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableLightBox,
  ObservableSetStore,
  ObservableSuggestionsPickerScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { SuggestionsPickerScreenIds } from '../../constants/ids/SuggestionsPickerScreenIds';
import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { SuggestionsPickerScreenDelegate } from '../../delegates/vocabulary/SuggestionsPickerScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { LightBoxAnimatableView } from '../light-box/LightBoxAnimatableView';
import { LightBoxTouchableBackground } from '../light-box/LightBoxTouchableBackground';
import { SuggestionsPickerContent } from './SuggestionsPickerContent';
import {
  SuggestionsPickerScreenStyles,
  suggestionsPickerScreenResponsiveStyles,
} from './SuggestionsPickerScreen.style';

export interface SuggestionsPickerScreenProps {
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableSuggestionsPickerScreen;
  themeStore: ObservableThemeStore;
  setStore: ObservableSetStore;
  screenDelegate: SuggestionsPickerScreenDelegate;
}

@observer
export class SuggestionsPickerScreen extends React.Component<
  SuggestionsPickerScreenProps
> {
  public get styles(): SuggestionsPickerScreenStyles {
    return suggestionsPickerScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        useSafeAreaView={false}
        observableScreen={this.props.observableScreen}
        testID={SuggestionsPickerScreenIds.SCREEN}
        style={this.styles.screen}>
        <LightBoxTouchableBackground
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          observableLightBox={this.props.observableLightBox}
          style={this.styles.light_box_container}
          enabled={true}
          activeOpacity={0.2}
          onPress={this.props.screenDelegate.close}>
          <LightBoxAnimatableView
            testID={SuggestionsPickerScreenIds.CONTAINER}
            observableLightBox={this.props.observableLightBox}>
            <View style={this.styles.inner_container}>
              {this.renderPickerHeader()}
              <View
                style={[
                  this.styles.picker_content_container,
                  {
                    height: this.props.observableScreen.screenLayout.height / 2,
                  },
                ]}>
                {this.renderPickerContent()}
              </View>
            </View>
          </LightBoxAnimatableView>
        </LightBoxTouchableBackground>
      </Screen>
    );
  }

  private renderPickerHeader(): null | React.ReactElement<any> {
    return (
      <View style={this.styles.picker_header}>
        <View style={this.styles.header_item_left}>
          <DefaultText style={this.styles.header_text_left}>
            Suggestions
          </DefaultText>
        </View>
        <TouchableOpacity
          style={this.styles.header_item_right}
          testID={VocabularyFormIds.CLOSE_PICKER_BTN}
          onPress={this.props.screenDelegate.close}
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}>
          <DefaultText style={this.styles.header_text_right}>Close</DefaultText>
        </TouchableOpacity>
      </View>
    );
  }

  private renderPickerContent(): React.ReactElement<any> {
    return (
      <SuggestionsPickerContent
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        learningLanguageName={
          this.props.setStore.existingCurrentSet.learningLanguage.fullName
        }
        translatedToLanguageName={
          this.props.setStore.existingCurrentSet.translatedToLanguage.fullName
        }
        suggestionListState={this.props.observableScreen.suggestionListState}
        getSuggestions={this.props.screenDelegate.getSuggestions}
        openLink={this.props.screenDelegate.openLink}
      />
    );
  }
}
