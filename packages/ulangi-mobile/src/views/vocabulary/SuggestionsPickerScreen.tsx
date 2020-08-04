/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDimensions,
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
import { LightBoxAnimatableView } from '../light-box/LightBoxAnimatableView';
import { LightBoxTouchableBackground } from '../light-box/LightBoxTouchableBackground';
import { SuggestionsPickerContent } from './SuggestionsPickerContent';
import {
  SuggestionsPickerScreenStyles,
  darkStyles,
  lightStyles,
} from './SuggestionsPickerScreen.style';

export interface SuggestionsPickerScreenProps {
  observableLightBox: ObservableLightBox;
  observableDimensions: ObservableDimensions;
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
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }
  public render(): React.ReactElement<any> {
    return (
      <LightBoxTouchableBackground
        testID={SuggestionsPickerScreenIds.SCREEN}
        observableLightBox={this.props.observableLightBox}
        observableDimensions={this.props.observableDimensions}
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
                  height: this.props.observableDimensions.windowHeight / 2,
                },
              ]}>
              {this.renderPickerContent()}
            </View>
          </View>
        </LightBoxAnimatableView>
      </LightBoxTouchableBackground>
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
