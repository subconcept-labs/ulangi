/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableReviewState } from '@ulangi/ulangi-observable';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';
import { DefinitionItem } from '../vocabulary/DefinitionItem';
import { VocabularyExtraFieldList } from '../vocabulary/VocabularyExtraFieldList';
import {
  ReviewItemStyles,
  darkStyles,
  definitionItemDarkStyles,
  definitionItemLightStyles,
  lightStyles,
} from './ReviewItem.style';

export interface ReviewItemProps {
  theme: Theme;
  reviewState: ObservableReviewState;
  styles?: {
    light: ReviewItemStyles;
    dark: ReviewItemStyles;
  };
}

@observer
export class ReviewItem extends React.Component<ReviewItemProps> {
  private animationContainerRef?: any;
  private unsubscribeAnimation?: () => void;

  public componentDidMount(): void {
    this.unsubscribeAnimation = autorun(
      (): void => {
        if (
          this.props.reviewState.shouldRunFadeOutAnimation === true &&
          this.animationContainerRef
        ) {
          this.animationContainerRef.fadeOutDown(200).then(
            (): void => {
              this.props.reviewState.shouldRunFadeOutAnimation = false;
            }
          );
        }
      }
    );
  }

  public componentWillUnmount(): void {
    if (this.unsubscribeAnimation) {
      this.unsubscribeAnimation();
    }
  }

  public get styles(): ReviewItemStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <Animatable.View
        style={this.styles.vocabulary_container}
        ref={(ref: any): void => {
          this.animationContainerRef = ref;
        }}
        animation="fadeInUp"
        duration={config.general.animationDuration}
        useNativeDriver={true}
      >
        <View style={this.styles.vocabulary_text_container}>
          <DefaultText style={this.styles.vocabulary_text}>
            {this.props.reviewState.vocabulary.vocabularyTerm}
          </DefaultText>
        </View>
        <VocabularyExtraFieldList
          theme={this.props.theme}
          extraFields={this.props.reviewState.vocabulary.vocabularyExtraFields}
        />
        {this.props.reviewState.shouldShowDefinitions === true ? (
          this.props.reviewState.vocabulary.definitions.map(
            (definition, index): React.ReactElement<any> => {
              return (
                <Animatable.View
                  animation="fadeIn"
                  key={definition.definitionId}
                >
                  <DefinitionItem
                    theme={this.props.theme}
                    index={index}
                    definition={definition}
                    styles={{
                      light: definitionItemLightStyles,
                      dark: definitionItemDarkStyles,
                    }}
                  />
                </Animatable.View>
              );
            }
          )
        ) : (
          <React.Fragment>
            <View style={this.styles.message_container}>
              <DefaultText style={this.styles.message_inline}>
                <DefaultText>What does it mean?</DefaultText>
              </DefaultText>
            </View>
          </React.Fragment>
        )}
      </Animatable.View>
    );
  }
}
