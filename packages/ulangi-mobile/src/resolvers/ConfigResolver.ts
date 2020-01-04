/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import {
  AutoArchiveSettingsResolver,
  DarkModeSettingsResolver,
  ReminderSettingsResolver,
} from '@ulangi/ulangi-common/resolvers';
import * as Joi from 'joi';

import { Config } from '../interfaces/Config';

export class ConfigResolver extends AbstractResolver<Config> {
  private autoArchiveSettingsResolver = new AutoArchiveSettingsResolver();
  private reminderSettingsResolver = new ReminderSettingsResolver();
  private darkModeSettingsResolver = new DarkModeSettingsResolver();

  protected rules = {
    general: {
      guestEmailDomain: Joi.string(),
      guestPassword: Joi.string(),
      checkDatabaseTimeout: Joi.number(),
      animationDuration: Joi.number(),
    },

    app: {
      showInAppRatingInMoreScreen: Joi.boolean(),
    },

    ad: {
      showAdTimeout: Joi.number(),
      autoSetUpAfterAuth: Joi.boolean(),
      autoInitializeAfterAuth: Joi.boolean(),
    },

    openSourceProjects: Joi.array().items({
      name: Joi.string(),
      description: Joi.string(),
      gitHubLink: Joi.string(),
    }),

    links: {
      reddit: Joi.string(),
      twitter: Joi.string(),
      instagram: Joi.string(),
      facebookPage: Joi.string(),
      facebookPageFallback: Joi.string(),
      installUlangiSheetsAddOnTutorial: Joi.string(),
      useUlangiSheetsAddOnTutorial: Joi.string(),
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
        primaryTextColor: Joi.string(),
        secondaryTextColor: Joi.string(),
        primaryBorderColor: Joi.string(),
        secondaryBorderColor: Joi.string(),
      },
      dark: {
        primaryBackgroundColor: Joi.string(),
        secondaryBackgroundColor: Joi.string(),
        primaryTextColor: Joi.string(),
        secondaryTextColor: Joi.string(),
        primaryBorderColor: Joi.string(),
        secondaryBorderColor: Joi.string(),
      },
    },

    remoteConfig: {
      autoUpdateAfterAuth: Joi.boolean(),
    },

    user: {
      passwordMinLength: Joi.number(),
      defaultGlobalAutoArchive: Joi.object(
        this.autoArchiveSettingsResolver.getRules(),
      ),
      defaultGlobalReminder: Joi.object(
        this.reminderSettingsResolver.getRules(),
      ),
      defaultDarkModeSettings: Joi.object(
        this.darkModeSettingsResolver.getRules(),
      ),
      autoCheckUserSessionAfterAuth: Joi.boolean(),
      autoFetchOnDownloadSucceededAfterAuth: Joi.boolean(),
    },

    set: {
      statusMap: Joi.object().pattern(/^/, {
        // TODO: Use validation for key
        name: Joi.string(),
      }),
      autoFetchAllOnDownloadSucceededAfterAuth: Joi.boolean(),
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
      statusMap: Joi.object().pattern(/^/, {
        name: Joi.string(),
      }),
    },

    level: {
      colorMap: Joi.array().items(Joi.string()),
    },

    category: {
      fetchSuggestionsLimit: Joi.number(),
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
      selectableInitialIntervals: Joi.array().items(Joi.number()),
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
      selectableInitialIntervals: Joi.array().items(Joi.number()),
      gradeScale: Joi.object().pattern(
        /^/,
        Joi.array().ordered(Joi.number(), Joi.number()),
      ),
    },

    quiz: {
      minPerWritingQuiz: Joi.number(),
      maxPerWritingQuiz: Joi.number(),
      minPerMultipleChoiceQuiz: Joi.number(),
      maxPerMultipleChoiceQuiz: Joi.number(),
      selectableWritingQuizLimits: Joi.array().items(Joi.number()),
      selectableMultipleChoiceQuizLimits: Joi.array().items(Joi.number()),
      gradeScale: Joi.object().pattern(
        /^/,
        Joi.array().ordered(Joi.number(), Joi.number()),
      ),
      selectableVocabularyPool: Joi.array().items(Joi.string()),
      defaultVocabularyPool: Joi.string().valid(['learned', 'active']),
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
      minToPlay: Joi.number(),
      fetchLimit: Joi.number(),
      fetchTriggerThreshold: Joi.number(),
      backgroundColor: Joi.string(),
      timePerQuestion: Joi.number(),
    },

    atom: {
      minToPlay: Joi.number(),
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

    flashcardPlayer: {
      minToPlay: Joi.number(),
      uploadLimit: Joi.number(),
      backgroundColor: Joi.string(),
      primaryColor: Joi.string(),
      secondaryColor: Joi.string(),
      textColor: Joi.string(),
    },

    audio: {
      cacheFolderName: Joi.string(),
      autoClearCacheAfterAuth: Joi.boolean(),
    },

    sync: {
      transactionChunkSize: Joi.number(),
      delayBetweenChunks: Joi.number(),
      autoObserveLocalUpdatesAfterAuth: Joi.boolean(),
      autoObserveRemoteUpdatesAfterAuth: Joi.boolean(),
    },

    reminder: {
      autoCheckPermissionAndSetUpReminder: Joi.boolean(),
    },
  };
}
