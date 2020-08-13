/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableDictionaryPickerScreen,
  ObservableLightBox,
  ObservableSetStore,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { DictionaryPickerScreenIds } from '../../constants/ids/DictionaryPickerScreenIds';
import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DictionaryPickerScreenDelegate } from '../../delegates/vocabulary/DictionaryPickerScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { LightBoxAnimatableView } from '../light-box/LightBoxAnimatableView';
import { LightBoxTouchableBackground } from '../light-box/LightBoxTouchableBackground';
import { DictionaryPickerContent } from './DictionaryPickerContent';
import {
  DictionaryPickerScreenStyles,
  dictionaryPickerScreenResponsiveStyles,
} from './DictionaryPickerScreen.style';

export interface DictionaryPickerScreenProps {
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableDictionaryPickerScreen;
  themeStore: ObservableThemeStore;
  setStore: ObservableSetStore;
  screenDelegate: DictionaryPickerScreenDelegate;
}

@observer
export class DictionaryPickerScreen extends React.Component<
  DictionaryPickerScreenProps
> {
  public get styles(): DictionaryPickerScreenStyles {
    return dictionaryPickerScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        useSafeAreaView={false}
        observableScreen={this.props.observableScreen}
        style={this.styles.screen}>
        <LightBoxTouchableBackground
          testID={DictionaryPickerScreenIds.SCREEN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          observableLightBox={this.props.observableLightBox}
          style={this.styles.light_box_container}
          enabled={true}
          activeOpacity={0.2}
          onPress={this.props.screenDelegate.close}>
          <LightBoxAnimatableView
            testID={DictionaryPickerScreenIds.CONTAINER}
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
            Dictionary
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
      <DictionaryPickerContent
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        learningLanguageName={
          this.props.setStore.existingCurrentSet.learningLanguage.fullName
        }
        translatedToLanguageName={
          this.props.setStore.existingCurrentSet.translatedToLanguage.fullName
        }
        dictionaryEntryState={this.props.observableScreen.dictionaryEntryState}
        translationListState={this.props.observableScreen.translationListState}
        getDictionaryEntry={this.props.screenDelegate.getDictionaryEntry}
        translate={this.props.screenDelegate.translate}
        showLink={this.props.screenDelegate.showLink}
        onPickDictionaryDefinition={
          this.props.screenDelegate.onPickDictionaryDefinition
        }
        onPickTranslation={this.props.screenDelegate.onPickTranslation}
      />
    );
  }
}
