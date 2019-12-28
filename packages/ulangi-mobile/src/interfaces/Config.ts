/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  Feedback,
  SetStatus,
  VocabularyFilterType,
  VocabularyStatus,
  WordClass,
} from '@ulangi/ulangi-common/enums';
import {
  AutoArchiveSettings,
  DarkModeSettings,
  ReminderSettings,
} from '@ulangi/ulangi-common/interfaces';

export interface Config {
  readonly general: {
    readonly guestEmailDomain: string;
    readonly guestPassword: string;
    readonly animationDuration: number;
    readonly checkDatabaseTimeout: number;
  };

  readonly app: {
    readonly showInAppRatingInMoreScreen: boolean;
  };

  readonly ad: {
    readonly showAdTimeout: number;
    readonly autoSetUpAfterAuth: boolean;
    readonly autoInitializeAfterAuth: boolean;
  };

  readonly links: {
    readonly github: string;
    readonly reddit: string;
    readonly twitter: string;
    readonly instagram: string;
    readonly facebookPage: string;
    readonly facebookPageFallback: string;
    readonly installUlangiSheetsAddOnTutorial: string;
    readonly useUlangiSheetsAddOnTutorial: string;
  };

  readonly styles: {
    readonly primaryColor: string;
    readonly lightPrimaryColor: string;
    readonly darkPrimaryColor: string;
    readonly blueColor: string;
    readonly greenColor: string;
    readonly regularMembershipColor: string;
    readonly premiumMembershipColor: string;
    readonly iosMainFont: string;
    readonly iosMainFontBold: string;
    readonly androidMainFont: string;
    readonly androidMainFontBold: string;
    readonly light: {
      primaryBackgroundColor: string;
      secondaryBackgroundColor: string;
      primaryTextColor: string;
      secondaryTextColor: string;
      primaryBorderColor: string;
      secondaryBorderColor: string;
    };
    readonly dark: {
      primaryBackgroundColor: string;
      secondaryBackgroundColor: string;
      primaryTextColor: string;
      secondaryTextColor: string;
      primaryBorderColor: string;
      secondaryBorderColor: string;
    };
  };

  readonly remoteConfig: {
    readonly autoUpdateAfterAuth: boolean;
  };

  readonly user: {
    readonly passwordMinLength: number;
    readonly defaultGlobalAutoArchive: AutoArchiveSettings;
    readonly defaultGlobalReminder: ReminderSettings;
    readonly defaultDarkModeSettings: DarkModeSettings;
    readonly autoCheckUserSessionAfterAuth: boolean;
    readonly autoFetchOnDownloadSucceededAfterAuth: boolean;
  };

  readonly set: {
    readonly statusMap: {
      [P in SetStatus]: {
        readonly name: string;
      }
    };
    readonly autoFetchAllOnDownloadSucceededAfterAuth: boolean;
  };

  readonly vocabulary: {
    readonly fetchLimit: number;
    readonly filterMap: {
      [P in VocabularyFilterType]: {
        readonly name: string;
        readonly shortName: string;
        readonly textColor: string;
        readonly borderColor: string;
      }
    };
    readonly statusMap: {
      [P in VocabularyStatus]: {
        readonly name: string;
      }
    };
  };

  readonly level: {
    readonly colorMap: string[];
  };

  readonly category: {
    readonly fetchSuggestionsLimit: number;
  };

  readonly builtInWordClass: {
    readonly map: {
      [P in WordClass]: {
        readonly name: string;
        readonly abbr: string;
        readonly textColor: string;
        readonly backgroundColor: string;
        readonly borderColor: string;
      }
    };
  };

  readonly customWordClass: {
    readonly map: {
      [P in string]: {
        readonly textColor: string;
        readonly backgroundColor: string;
        readonly borderColor: string;
      }
    };
  };

  readonly search: {
    readonly searchLimit: number;
  };

  readonly manage: {
    readonly fetchVocabularyLimit: number;
    readonly fetchCategoryLimit: number;
  };

  readonly library: {
    readonly fetchPublicSetLimit: number;
    readonly searchPublicSetLimit: number;
    readonly searchPublicVocabularyLimit: number;
  };

  readonly reviewFeedback: {
    readonly feedbackMap: {
      [P in Feedback]: {
        readonly color: string;
      }
    };
  };

  readonly lightBox: {
    readonly animationDuration: number;
  };

  readonly spacedRepetition: {
    readonly maxLevel: number;
    readonly minPerLesson: number;
    readonly maxPerLesson: number;
    readonly selectableLimits: readonly number[];
    readonly defaultInitialInterval: number;
    readonly selectableInitialIntervals: readonly number[];
    readonly gradeScale: { [P in string]: [number, number] };
  };

  readonly writing: {
    readonly maxLevel: number;
    readonly minPerLesson: number;
    readonly maxPerLesson: number;
    readonly selectableLimits: readonly number[];
    readonly defaultInitialInterval: number;
    readonly selectableInitialIntervals: readonly number[];
    readonly gradeScale: { [P in string]: [number, number] };
  };

  readonly quiz: {
    readonly minPerWritingQuiz: number;
    readonly maxPerWritingQuiz: number;
    readonly minPerMultipleChoiceQuiz: number;
    readonly maxPerMultipleChoiceQuiz: number;
    readonly selectableWritingQuizLimits: readonly number[];
    readonly selectableMultipleChoiceQuizLimits: readonly number[];
    readonly selectableVocabularyPool: readonly ('learned' | 'active')[];
    readonly defaultVocabularyPool: 'learned' | 'active';
    readonly gradeScale: { [P in string]: [number, number] };
  };

  readonly atom: {
    readonly minToPlay: number;
    readonly fetchLimit: number;
    readonly fetchTriggerThreshold: number;
    readonly minCharacters: number;
    readonly maxCharacters: number;
    readonly initialMoveCount: number;
    readonly backgroundColor: string;
    readonly primaryColor: string;
    readonly secondaryColor: string;
    readonly textColor: string;
    readonly particleSize: number;
    readonly innerShellDiameter: number;
    readonly outerShellDiameter: number;
    readonly originSize: number;
    readonly bottomOffset: number;
  };

  readonly reflex: {
    readonly minToPlay: number;
    readonly fetchLimit: number;
    readonly fetchTriggerThreshold: number;
    readonly backgroundColor: string;
    readonly timePerQuestion: number;
  };

  readonly flashcardPlayer: {
    readonly minToPlay: number;
    readonly uploadLimit: number;
    readonly backgroundColor: string;
    readonly primaryColor: string;
    readonly secondaryColor: string;
    readonly textColor: string;
  };

  readonly audio: {
    readonly cacheFolderName: string;
    readonly autoClearCacheAfterAuth: boolean;
  };

  readonly sync: {
    readonly transactionChunkSize: number;
    readonly delayBetweenChunks: number;
    readonly autoObserveLocalUpdatesAfterAuth: boolean;
    readonly autoObserveRemoteUpdatesAfterAuth: boolean;
  };

  readonly reminder: {
    readonly autoCheckPermissionAndSetUpReminder: boolean;
  };
}
