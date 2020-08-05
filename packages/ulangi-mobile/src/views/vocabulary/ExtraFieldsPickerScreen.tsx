/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ExtraFieldDetail } from '@ulangi/ulangi-common/core';
import {
  ObservableLightBox,
  ObservableScreen,
  ObservableSetStore,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ExtraFieldsPickerScreenIds } from '../../constants/ids/ExtraFieldsPickerScreenIds';
import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { ExtraFieldsPickerScreenDelegate } from '../../delegates/vocabulary/ExtraFieldsPickerScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { LightBoxAnimatableView } from '../light-box/LightBoxAnimatableView';
import { LightBoxTouchableBackground } from '../light-box/LightBoxTouchableBackground';
import { ExtraFieldsPickerContent } from './ExtraFieldsPickerContent';
import {
  ExtraFieldsPickerScreenStyles,
  extraFieldsPickerScreenResponsiveStyles,
} from './ExtraFieldsPickerScreen.style';

export interface ExtraFieldsPickerScreenProps {
  kind: 'vocabulary' | 'definition';
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableScreen;
  themeStore: ObservableThemeStore;
  setStore: ObservableSetStore;
  screenDelegate: ExtraFieldsPickerScreenDelegate;
  onPick: (
    extraFieldDetail: ExtraFieldDetail,
    value: string,
    cursor: undefined | number,
  ) => void;
  selectImages: () => void;
}

@observer
export class ExtraFieldsPickerScreen extends React.Component<
  ExtraFieldsPickerScreenProps
> {
  public get styles(): ExtraFieldsPickerScreenStyles {
    return extraFieldsPickerScreenResponsiveStyles.compile(
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
          testID={ExtraFieldsPickerScreenIds.SCREEN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          observableLightBox={this.props.observableLightBox}
          style={this.styles.light_box_container}
          enabled={true}
          activeOpacity={0.2}
          onPress={this.props.screenDelegate.close}>
          <LightBoxAnimatableView
            testID={ExtraFieldsPickerScreenIds.CONTAINER}
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

  private renderPickerHeader(): React.ReactElement<any> {
    return (
      <View style={this.styles.picker_header}>
        <View style={this.styles.header_item_left}>
          <DefaultText style={this.styles.header_text_left}>
            Extra Fields
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
      <ExtraFieldsPickerContent
        theme={this.props.themeStore.theme}
        screenLayout={this.props.observableScreen.screenLayout}
        kind={this.props.kind}
        learningLanguageCode={
          this.props.setStore.existingCurrentSet.learningLanguage.languageCode
        }
        selectImages={this.props.selectImages}
        onPick={this.props.onPick}
      />
    );
  }
}
