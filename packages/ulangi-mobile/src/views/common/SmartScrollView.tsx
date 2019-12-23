/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import * as React from 'react';
import { ScrollView, ScrollViewProperties } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { FixedTouchableWithoutFeedback } from './FixedTouchableWithoutFeedback';

// This component fix scroll view not scrollable when wrapped by a pan responder (such as DismissKeyboardView)
class DecorateScrollView extends React.Component<
  ScrollViewProperties & {
    forwardedRef?: any;
    keyboardAware?: boolean;
    fixScrollingInsideTouchable?: boolean;
  }
> {
  private renderChildren(): React.ReactNode | React.ReactElement<any> {
    if (
      typeof this.props.fixScrollingInsideTouchable === 'undefined' ||
      this.props.fixScrollingInsideTouchable === true
    ) {
      // If scrollView is horizontal, we need to wrap each children
      if (this.props.horizontal === true && _.isArray(this.props.children)) {
        return (
          <React.Fragment>
            {this.props.children.map(
              (child, index): React.ReactElement<any> => {
                return (
                  <FixedTouchableWithoutFeedback
                    key={_.get(child, 'key') || index}>
                    {child}
                  </FixedTouchableWithoutFeedback>
                );
              },
            )}
          </React.Fragment>
        );
      } else {
        return (
          <FixedTouchableWithoutFeedback>
            {this.props.children}
          </FixedTouchableWithoutFeedback>
        );
      }
    } else {
      return this.props.children;
    }
  }

  public render(): React.ReactElement<any> {
    const { forwardedRef, ...rest } = this.props;
    const children = this.renderChildren();

    if (this.props.keyboardAware === true) {
      return (
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          ref={forwardedRef}
          {...rest}>
          {children}
        </KeyboardAwareScrollView>
      );
    } else {
      return (
        <ScrollView ref={forwardedRef} {...rest}>
          {children}
        </ScrollView>
      );
    }
  }
}

// This component forwards ref to the inner ScrollView
export const SmartScrollView = React.forwardRef(function decorateScrollView(
  props: ScrollViewProperties & {
    children?: any;
    keyboardAware?: boolean;
    fixScrollingInsideTouchable?: boolean;
  },
  ref: any,
): React.ReactElement<any> {
  return (
    <DecorateScrollView forwardedRef={ref} {...props}>
      {props.children}
    </DecorateScrollView>
  );
});
