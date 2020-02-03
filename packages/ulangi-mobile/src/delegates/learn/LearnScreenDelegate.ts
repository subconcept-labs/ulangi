/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { FeatureSettings } from '@ulangi/ulangi-common/interfaces';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { FeatureSettingsDelegate } from './FeatureSettingsDelegate';

@boundClass
export class LearnScreenDelegate {
  private featureSettingsDelegate: FeatureSettingsDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    featureSettingsDelegate: FeatureSettingsDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.featureSettingsDelegate = featureSettingsDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public getCurrentFeatureSettings(): FeatureSettings {
    return this.featureSettingsDelegate.getCurrentSettings();
  }

  public navigateToFeatureManagementScreen(): void {
    this.navigatorDelegate.push(ScreenName.FEATURE_MANAGEMENT_SCREEN, {});
  }

  public navigateToSpacedRepetitionScreen(): void {
    this.navigatorDelegate.push(ScreenName.SPACED_REPETITION_SCREEN, {
      selectedCategoryNames: undefined,
    });
  }

  public navigateToWritingScreen(): void {
    this.navigatorDelegate.push(ScreenName.WRITING_SCREEN, {
      selectedCategoryNames: undefined,
    });
  }

  public navigateToQuizScreen(): void {
    this.navigatorDelegate.push(ScreenName.QUIZ_SCREEN, {
      selectedCategoryNames: undefined,
    });
  }

  public navigateToAtomScreen(): void {
    this.navigatorDelegate.push(ScreenName.ATOM_SCREEN, {
      selectedCategoryNames: undefined,
    });
  }

  public navigateToReflexScreen(): void {
    this.navigatorDelegate.push(ScreenName.REFLEX_SCREEN, {
      selectedCategoryNames: undefined,
    });
  }
}
