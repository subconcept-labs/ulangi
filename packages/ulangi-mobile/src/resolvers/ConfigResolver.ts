/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import { ReviewPriority, ReviewStrategy } from '@ulangi/ulangi-common/enums';
import {
  AutoArchiveSettingsResolver,
  FeatureSettingsResolver,
  ReminderSettingsResolver,
  ThemeSettingsResolver,
} from '@ulangi/ulangi-common/resolvers';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { Config } from '../interfaces/Config';

export class ConfigResolver extends AbstractResolver<Config> {
  private autoArchiveSettingsResolver = new AutoArchiveSettingsResolver();
  private featureSettingsResolver = new FeatureSettingsResolver();
  private reminderSettingsResolver = new ReminderSettingsResolver();
  private themeSettingsResolver = new ThemeSettingsResolver();

  protected rules = {
    general: {
      guestEmailDomain: Joi.string(),
      guestPassword: Joi.string(),
      checkDatabaseTimeout: Joi.number(),
      animationDuration: Joi.number(),
    },

    ad: {
      showAdTimeout: Joi.number(),
    },

    links: {
      reddit: Joi.string(),
      twitter: Joi.string(),
      instagram: Joi.string(),
      facebookPage: Joi.string(),
      facebookPageFallback: Joi.string(),
      github: Joi.string(),
      ulangiSheetsAddOn: {
        youtubeDemo: Joi.string(),
        installTutorial: Joi.string(),
        useTutorial: Joi.string(),
      },
    },

    styles: {
      primaryColor: Joi.string(),
      lightPrimaryColor: Joi.string(),
      darkPrimaryColor: Joi.string(),
      blueColor: Joi.string(),
      greenColor: Joi.string(),
      regularMembershipColor: Joi.string(),
      premiumMembershipColor: Joi.string(),
      iosMainFont: Joi.string(),
      iosMainFontBold: Joi.string(),
      androidMainFont: Joi.string(),
      androidMainFontBold: Joi.string(),
      light: {
        primaryBackgroundColor: Joi.string(),
        secondaryBackgroundColor: Joi.string(),
        tertiaryBackgroundColor: Joi.string(),
        primaryTextColor: Joi.string(),
        secondaryTextColor: Joi.string(),
        primaryBorderColor: Joi.string(),
        secondaryBorderColor: Joi.string(),
      },
      dark: {
        primaryBackgroundColor: Joi.string(),
        secondaryBackgroundColor: Joi.string(),
        tertiaryBackgroundColor: Joi.string(),
        primaryTextColor: Joi.string(),
        secondaryTextColor: Joi.string(),
        primaryBorderColor: Joi.string(),
        secondaryBorderColor: Joi.string(),
      },
    },

    user: {
      passwordMinLength: Joi.number(),
      defaultGlobalAutoArchive: Joi.object(
        this.autoArchiveSettingsResolver.getRules(),
      ),
      defaultGlobalReminder: Joi.object(
        this.reminderSettingsResolver.getRules(),
      ),
      defaultThemeSettings: Joi.object(this.themeSettingsResolver.getRules()),
    },

    set: {
      statusMap: Joi.object().pattern(/^/, {
        // TODO: Use validation for key
        name: Joi.string(),
      }),
      defaultFeatureSettings: Joi.object(
        this.featureSettingsResolver.getRules(),
      ),
    },

    vocabulary: {
      fetchLimit: Joi.number(),
      filterMap: Joi.object().pattern(/^/, {
        // TODO: Use better validation for key
        name: Joi.string(),
        shortName: Joi.string(),
        textColor: Joi.string(),
        borderColor: Joi.string(),
      }),
      sortMap: Joi.object().pattern(/^/, {
        name: Joi.string(),
        longName: Joi.string(),
      }),
      statusMap: Joi.object().pattern(/^/, {
        name: Joi.string(),
      }),
    },

    level: {
      colorMap: Joi.array().items(Joi.string()),
    },

    heatMap: {
      mapping: Joi.array().items({
        range: Joi.array().ordered(Joi.number(), Joi.number()),
        styles: {
          backgroundColor: Joi.string(),
        },
      }),
      onFire: {
        min: Joi.number(),
        styles: {
          backgroundColor: Joi.string(),
        },
      },
      unavailable: {
        styles: {
          borderColor: Joi.string(),
          borderWidth: Joi.number(),
        },
      },
    },

    category: {
      fetchSuggestionsLimit: Joi.number(),
      sortMap: Joi.object().pattern(/^/, {
        name: Joi.string(),
        longName: Joi.string(),
      }),
    },

    reviewFeedback: {
      feedbackMap: Joi.object().pattern(/^/, {
        color: Joi.string(),
      }),
    },

    manage: {
      fetchVocabularyLimit: Joi.number(),
      fetchCategoryLimit: Joi.number(),
    },

    search: {
      searchLimit: Joi.number(),
    },

    library: {
      fetchPublicSetLimit: Joi.number(),
      searchPublicSetLimit: Joi.number(),
      searchPublicVocabularyLimit: Joi.number(),
    },

    spacedRepetition: {
      maxLevel: Joi.number(),
      minPerLesson: Joi.number(),
      maxPerLesson: Joi.number(),
      selectableLimits: Joi.array().items(Joi.number()),
      defaultInitialInterval: Joi.number(),
      defaultReviewStrategy: Joi.string().valid(_.values(ReviewStrategy)),
      defaultReviewPriority: Joi.string().valid(_.values(ReviewPriority)),
      defaultFeedbackButtons: Joi.number().valid([3, 4, 5]),
      defaultAutoplayAudio: Joi.boolean(),
      selectableInitialIntervals: Joi.array().items(Joi.number()),
      selectableFeedbackButtons: Joi.array().items(
        Joi.number().valid([3, 4, 5]),
      ),
      gradeScale: Joi.object().pattern(
        /^/,
        Joi.array().ordered(Joi.number(), Joi.number()),
      ),
    },

    writing: {
      maxLevel: Joi.number(),
      minPerLesson: Joi.number(),
      maxPerLesson: Joi.number(),
      selectableLimits: Joi.array().items(Joi.number()),
      defaultInitialInterval: Joi.number(),
      defaultFeedbackButtons: Joi.number(),
      defaultAutoplayAudio: Joi.boolean(),
      defaultAutoShowKeyboard: Joi.boolean(),
      defaultHighlightOnError: Joi.boolean(),
      defaultReviewPriority: Joi.string().valid(_.values(ReviewPriority)),
      selectableInitialIntervals: Joi.array().items(Joi.number()),
      selectableFeedbackButtons: Joi.array().items(Joi.number()),
      gradeScale: Joi.object().pattern(
        /^/,
        Joi.array().ordered(Joi.number(), Joi.number()),
      ),
    },

    quiz: {
      defaultVocabularyPool: Joi.string().valid(['learned', 'active']),
      selectableVocabularyPool: Joi.array().items(Joi.string()),
      multipleChoice: {
        minPerQuiz: Joi.number(),
        defaultQuizSize: Joi.number(),
        selectableQuizSizes: Joi.array().items(Joi.number()),
      },
      writing: {
        minPerQuiz: Joi.number(),
        defaultQuizSize: Joi.number(),
        selectableQuizSizes: Joi.array().items(Joi.number()),
        defaultAutoShowKeyboard: Joi.boolean(),
        defaultHighlightOnError: Joi.boolean(),
      },
      gradeScale: Joi.object().pattern(
        /^/,
        Joi.array().ordered(Joi.number(), Joi.number()),
      ),
    },

    builtInWordClass: {
      map: Joi.object().pattern(/^/, {
        // TODO: Use validation for key
        name: Joi.string(),
        abbr: Joi.string(),
        textColor: Joi.string(),
        backgroundColor: Joi.string(),
        borderColor: Joi.string(),
      }),
    },

    customWordClass: {
      map: Joi.object().pattern(/^/, {
        textColor: Joi.string(),
        backgroundColor: Joi.string(),
        borderColor: Joi.string(),
      }),
    },

    lightBox: {
      animationDuration: Joi.number(),
    },

    reflex: {
      fetchLimit: Joi.number(),
      fetchTriggerThreshold: Joi.number(),
      backgroundColor: Joi.string(),
      timePerQuestion: Joi.number(),
    },

    atom: {
      fetchLimit: Joi.number(),
      fetchTriggerThreshold: Joi.number(),
      minCharacters: Joi.number(),
      maxCharacters: Joi.number(),
      initialMoveCount: Joi.number(),
      backgroundColor: Joi.string(),
      primaryColor: Joi.string(),
      secondaryColor: Joi.string(),
      textColor: Joi.string(),
      particleSize: Joi.number(),
      innerShellDiameter: Joi.number(),
      outerShellDiameter: Joi.number(),
      originSize: Joi.number(),
      bottomOffset: Joi.number(),
    },

    audio: {
      cacheFolderName: Joi.string(),
    },

    sync: {
      delayBetweenTransactions: Joi.number(),
    },
  };
}
