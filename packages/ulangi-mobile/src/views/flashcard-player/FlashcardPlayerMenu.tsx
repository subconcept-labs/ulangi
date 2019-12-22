/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { FlashcardPlayerScreenIds } from '../../constants/ids/FlashcardPlayerScreenIds';
import { FlashcardPlayerStyle } from '../../styles/FlashcardPlayerStyle';
import { DefaultButton } from '../common/DefaultButton';

export interface FlashcardPlayerMenuProps {
  uploadToFlashcardPlayer: () => void;
}

export class FlashcardPlayerMenu extends React.Component<
  FlashcardPlayerMenuProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <DefaultButton
          testID={FlashcardPlayerScreenIds.UPLOAD_BTN}
          text="Start"
          styles={FlashcardPlayerStyle.getPrimaryMenuButtonStyles()}
          onPress={this.props.uploadToFlashcardPlayer}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});
