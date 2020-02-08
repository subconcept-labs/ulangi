/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import {
  ApiScope,
  ConsentStatus,
  Feedback,
  SetStatus,
  SyncTask,
  Theme,
  VocabularyDueType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import {
  AutoArchiveSettings,
  Category,
  DictionaryEntry,
  ErrorBag,
  PixabayImage,
  Product,
  PublicSet,
  PublicVocabulary,
  Purchase,
  RemoteConfig,
  Set,
  Translation,
  TranslationWithLanguages,
  User,
  Vocabulary,
} from '@ulangi/ulangi-common/interfaces';

export interface ActionPayload {
  [P: string]: null | object;

  readonly APP__INITIALIZE: null;
  readonly APP__INITIALIZING: null;
  readonly APP__INITIALIZE_SUCCEEDED: null;
  readonly APP__INITIALIZE_FAILED: ErrorBag;
  readonly APP__ALREADY_INITIALIZED: null;

  readonly DATA_SHARING__ENABLE_ANALYTICS: null;
  readonly DATA_SHARING__ENABLING_ANALYTICS: null;
  readonly DATA_SHARING__ENABLE_ANALYTICS_SUCCEEDED: null;
  readonly DATA_SHARING__ENABLE_ANALYTICS_FAILED: ErrorBag;
  readonly DATA_SHARING__DISABLE_ANALYTICS: null;
  readonly DATA_SHARING__DISABLING_ANALYTICS: null;
  readonly DATA_SHARING__DISABLE_ANALYTICS_SUCCEEDED: null;
  readonly DATA_SHARING__DISABLE_ANALYTICS_FAILED: ErrorBag;

  readonly IAP__INIT: { googlePackageName: string };
  readonly IAP__INITING: null;
  readonly IAP__INIT_SUCEEDED: null;
  readonly IAP__INIT_FAILED: ErrorBag;
  readonly IAP__GET_PRODUCTS: { skus: readonly string[] };
  readonly IAP__GETTING_PRODUCTS: null;
  readonly IAP__GET_PRODUCTS_SUCCEEDED: { products: readonly Product[] };
  readonly IAP__GET_PRODUCTS_FAILED: ErrorBag;
  readonly IAP__REQUEST_PURCHASE: { sku: string };
  readonly IAP__REQUESTNG_PURCHASE: null;
  readonly IAP__REQUEST_PURCHASE_SUCCEEDED: null;
  readonly IAP__REQUEST_PURCHASE_FAILED: ErrorBag;
  readonly IAP__RESTORE_PURCHASES: null;
  readonly IAP__RESTORING_PURCHASES: null;
  readonly IAP__RESTORE_PURCHASES_SUCCEEDED: null;
  readonly IAP__RESTORE_PURCHASES_FAILED: ErrorBag;
  readonly IAP__PROCESSING_PURCHASE: {
    transactionId?: string;
    productId: string;
  };
  readonly IAP__PROCESS_PURCHASE_SUCCEEDED: {
    purchasesSuccessfullyApplied: readonly Purchase[];
    purchasesAlreadyApplied: readonly Purchase[];
    purchasesAlreadyAppliedToOtherAccounts: readonly Purchase[];
  };
  readonly IAP__PROCESS_PURCHASE_FAILED: ErrorBag;

  readonly AD__SET_UP: {
    publisherId: string;
    consentFormDebugDeviceId: undefined | string;
    consentFormDebugGeography: undefined | 'EEA' | 'NOT_EEA';
  };
  readonly AD__SET_UP_SUCCEEDED: null;
  readonly AD__SET_UP_FAILED: ErrorBag;
  readonly AD__INITIALIZE: {
    adAppId: string;
  };
  readonly AD__INITIALIZE_SUCCEEDED: null;
  readonly AD__INITIALIZE_FAILED: ErrorBag;
  readonly AD__GET_CONSENT_STATUS_SUCCEEDED: { consentStatus: ConsentStatus };
  readonly AD__GET_REQUEST_LOCATION_SUCCEEDED: { isInEeaOrUnknown: boolean };
  readonly AD__CONSENT_STATUS_CHANGED: { consentStatus: ConsentStatus };
  readonly AD__SHOW_GOOGLE_CONSENT_FORM: {
    privacyPolicyUrl: string;
    shouldOfferAdFree: boolean;
  };
  readonly AD__SHOW_GOOGLE_CONSENT_FORM_FAILED: ErrorBag;
  readonly AD__LOAD_AD: {
    adUnitId: string;
    consentStatus: ConsentStatus;
    adTestDeviceId: undefined | string;
  };
  readonly AD__LOADING_AD: null;
  readonly AD__LOAD_AD_SUCCEEDED: null;
  readonly AD__LOAD_AD_FAILED: ErrorBag;
  readonly AD__SHOW_AD: null;
  readonly AD__SHOWING_AD: null;
  readonly AD__SHOW_AD_SUCCEEDED: null;
  readonly AD__SHOW_AD_FAILED: ErrorBag;
  readonly AD__AD_OPENED: null;
  readonly AD__AD_CLOSED: null;
  readonly AD__CLEAR_AD: null;

  readonly API_KEY__GET_API_KEY: {
    password: string;
    apiScope: ApiScope;
  };
  readonly API_KEY__GETTING_API_KEY: null;
  readonly API_KEY__GET_API_KEY_SUCCEEDED: {
    apiKey: string;
    expiredAt: Date | null;
  };
  readonly API_KEY__GET_API_KEY_FAILED: ErrorBag;
  readonly API_KEY__DELETE_API_KEY: { apiKey: string };
  readonly API_KEY__DELETING_API_KEY: null;
  readonly API_KEY__DELETE_API_KEY_SUCCEEDED: null;
  readonly API_KEY__DELETE_API_KEY_FAILED: ErrorBag;
  readonly API_KEY__SEND_API_KEY: {
    apiKey: string;
    expiredAt: null | Date;
  };
  readonly API_KEY__SENDING_API_KEY: null;
  readonly API_KEY__SEND_API_KEY_SUCCEEDED: {
    success: boolean;
  };
  readonly API_KEY__SEND_API_KEY_FAILED: ErrorBag;

  readonly ATOM__PREPARE_FETCH_VOCABULARY: {
    setId: string;
    selectedCategoryNames: undefined | string[];
  };
  readonly ATOM__PREPARING_FETCH_VOCABULARY: null;
  readonly ATOM__PREPARE_FETCH_VOCABULARY_SUCCEEDED: null;
  readonly ATOM__PREPARE_FETCH_VOCABULARY_FAILED: ErrorBag;
  readonly ATOM__FETCH_VOCABULARY: null;
  readonly ATOM__FETCHING_VOCABULARY: null;
  readonly ATOM__FETCH_VOCABULARY_SUCCEEDED: {
    vocabularyList: readonly Vocabulary[];
    noMore: boolean;
  };
  readonly ATOM__FETCH_VOCABULARY_FAILED: ErrorBag;
  readonly ATOM__CLEAR_FETCH_VOCABULARY: null;

  readonly AUDIO__SYNTHESIZE_SPEECH: { text: string; languageCode: string };
  readonly AUDIO__SYNTHESIZING_SPEECH: null;
  readonly AUDIO__SYNTHESIZE_SPEECH_SUCCEEDED: {
    text: string;
    filePath: string;
  };
  readonly AUDIO__SYNTHESIZE_SPEECH_FAILED: ErrorBag;
  readonly AUDIO__CLEAR_SYNTHESIZED_SPEECH_CACHE: null;
  readonly AUDIO__CLEARING_SYNTHESIZED_SPEECH_CACHE: null;
  readonly AUDIO__CLEAR_SYNTHESIZED_SPEECH_CACHE_SUCCEEDED: null;
  readonly AUDIO__CLEAR_SYNTHESIZED_SPEECH_CACHE_FAILED: ErrorBag;
  readonly AUDIO__PLAY: { filePath: string };
  readonly AUDIO__PLAYING: null;
  readonly AUDIO__PLAY_SUCCEEDED: null;
  readonly AUDIO__PLAY_FAILED: ErrorBag;

  readonly CATEGORY__PREPARE_FETCH_SUGGESTIONS: { term: string; setId: string };
  readonly CATEGORY__PREPARING_FETCH_SUGGESTIONS: null;
  readonly CATEGORY__PREPARE_FETCH_SUGGESTIONS_SUCCEEDED: null;
  readonly CATEGORY__PREPARE_FETCH_SUGGESTIONS_FAILED: ErrorBag;
  readonly CATEGORY__FETCH_SUGGESTIONS: null;
  readonly CATEGORY__FETCHING_SUGGESTIONS: null;
  readonly CATEGORY__FETCH_SUGGESTIONS_SUCCEEDED: {
    categoryNames: readonly string[];
    noMore: boolean;
  };
  readonly CATEGORY__FETCH_SUGGESTIONS_FAILED: ErrorBag;
  readonly CATEGORY__CLEAR_FETCH_SUGGESTIONS: null;

  readonly DATABASE__CONNECT_SHARED_DB: null;
  readonly DATABASE__CONNECTING_SHARED_DB: null;
  readonly DATABASE__CONNECT_SHARED_DB_SUCCEEDED: null;
  readonly DATABASE__CONNECT_SHARED_DB_FAILED: ErrorBag;
  readonly DATABASE__ALREADY_CONNECTED_SHARED_DB: null;
  readonly DATABASE__CHECK_SHARED_DB: null;
  readonly DATABASE__CHECKING_SHARED_DB: null;
  readonly DATABASE__CHECK_SHARED_DB_SUCCEEDED: null;
  readonly DATABASE__CHECK_SHARED_DB_FAILED: ErrorBag;
  readonly DATABASE__ALREADY_CHECKED_SHARED_DB: null;
  readonly DATABASE__CONNECT_USER_DB: { userId: string };
  readonly DATABASE__CONNECTING_USER_DB: null;
  readonly DATABASE__CONNECT_USER_DB_SUCCEEDED: null;
  readonly DATABASE__CONNECT_USER_DB_FAILED: ErrorBag;
  readonly DATABASE__CHECK_USER_DB: null;
  readonly DATABASE__CHECKING_USER_DB: null;
  readonly DATABASE__CHECK_USER_DB_TIMEOUT_EXCEEDED: null;
  readonly DATABASE__CHECK_USER_DB_SUCCEEDED: null;
  readonly DATABASE__CHECK_USER_DB_FAILED: ErrorBag;

  readonly DICTIONARY__CLEAR_ENTRY: null;
  readonly DICTIONARY__GET_ENTRY: {
    searchTerm: string;
    searchTermLanguageCode: string;
    translatedToLanguageCode: string;
  };
  readonly DICTIONARY__GETTING_ENTRY: null;
  readonly DICTIONARY__GET_ENTRY_SUCCEEDED: {
    dictionaryEntry: DictionaryEntry;
  };
  readonly DICTIONARY__GET_ENTRY_FAILED: ErrorBag & {
    searchTerm: string;
  };

  readonly LIBRARY__PREPARE_SEARCH_PUBLIC_VOCABULARY: {
    languageCodePair: string;
    searchTerm: string;
  };
  readonly LIBRARY__PREPARING_SEARCH_PUBLIC_VOCABULARY: null;
  readonly LIBRARY__PREPARE_SEARCH_PUBLIC_VOCABULARY_SUCCEEDED: null;
  readonly LIBRARY__PREPARE_SEARCH_PUBLIC_VOCABULARY_FAILED: ErrorBag;
  readonly LIBRARY__SEARCH_PUBLIC_VOCABULARY: null;
  readonly LIBRARY__SEARCHING_PUBLIC_VOCABULARY: null;
  readonly LIBRARY__SEARCH_PUBLIC_VOCABULARY_SUCCEEDED: {
    vocabularyList: readonly PublicVocabulary[];
    noMore: boolean;
  };
  readonly LIBRARY__SEARCH_PUBLIC_VOCABULARY_FAILED: ErrorBag;
  readonly LIBRARY__CLEAR_SEARCH_PUBLIC_VOCABULARY: null;
  readonly LIBRARY__PREPARE_SEARCH_PUBLIC_SETS: {
    languageCodePair: string;
    searchTerm: string;
  };
  readonly LIBRARY__PREPARING_SEARCH_PUBLIC_SETS: null;
  readonly LIBRARY__PREPARE_SEARCH_PUBLIC_SETS_SUCCEEDED: null;
  readonly LIBRARY__PREPARE_SEARCH_PUBLIC_SETS_FAILED: ErrorBag;
  readonly LIBRARY__SEARCH_PUBLIC_SETS: null;
  readonly LIBRARY__SEARCHING_PUBLIC_SETS: null;
  readonly LIBRARY__SEARCH_PUBLIC_SETS_SUCCEEDED: {
    setList: readonly PublicSet[];
    noMore: boolean;
  };
  readonly LIBRARY__SEARCH_PUBLIC_SETS_FAILED: ErrorBag;
  readonly LIBRARY__CLEAR_SEARCH_PUBLIC_SETS: null;
  readonly LIBRARY__TRANSLATE_BIDIRECTION: {
    languageCodePair: string;
    sourceText: string;
  };

  readonly LIBRARY__GET_PUBLIC_SET_COUNT: { languageCodePair: string };
  readonly LIBRARY__GETTING_PUBLIC_SET_COUNT: null;
  readonly LIBRARY__GET_PUBLIC_SET_COUNT_SUCCEEDED: { count: number };
  readonly LIBRARY__GET_PUBLIC_SET_COUNT_FAILED: ErrorBag;

  readonly MANAGE__PREPARE_FETCH_VOCABULARY:
  | {
    filterBy: 'VocabularyStatus';
    setId: string;
    vocabularyStatus: VocabularyStatus;
    categoryName?: string;
  }
  | {
    filterBy: 'VocabularyDueType';
    setId: string;
    initialInterval: number;
    dueType: VocabularyDueType;
    categoryName?: string;
  };
  readonly MANAGE__PREPARING_FETCH_VOCABULARY: null;
  readonly MANAGE__PREPARE_FETCH_VOCABULARY_SUCCEEDED: null;
  readonly MANAGE__PREPARE_FETCH_VOCABULARY_FAILED: ErrorBag;
  readonly MANAGE__FETCH_VOCABULARY: null;
  readonly MANAGE__FETCHING_VOCABULARY: null;
  readonly MANAGE__FETCH_VOCABULARY_SUCCEEDED: {
    vocabularyList: readonly Vocabulary[];
    noMore: boolean;
  };
  readonly MANAGE__FETCH_VOCABULARY_FAILED: ErrorBag;
  readonly MANAGE__CLEAR_FETCH_VOCABULARY: null;
  readonly MANAGE__PREPARE_FETCH_CATEGORY:
  | {
    filterBy: 'VocabularyStatus';
    setId: string;
    vocabularyStatus: VocabularyStatus;
  }
  | {
    filterBy: 'VocabularyDueType';
    setId: string;
    initialInterval: number;
    dueType: VocabularyDueType;
  };
  readonly MANAGE__PREPARING_FETCH_CATEGORY: null;
  readonly MANAGE__PREPARE_FETCH_CATEGORY_SUCCEEDED: null;
  readonly MANAGE__PREPARE_FETCH_CATEGORY_FAILED: ErrorBag;
  readonly MANAGE__FETCH_CATEGORY: null;
  readonly MANAGE__FETCHING_CATEGORY: null;
  readonly MANAGE__FETCH_CATEGORY_SUCCEEDED: {
    categoryList: readonly Category[];
    noMore: boolean;
  };
  readonly MANAGE__FETCH_CATEGORY_FAILED: ErrorBag;
  readonly MANAGE__CLEAR_FETCH_CATEGORY: null;
  readonly MANAGE__RESET: null;

  readonly NETWORK__CHECK_CONNECTION: null;
  readonly NETWORK__CHECKING_CONNECTION: null;
  readonly NETWORK__CHECK_CONNECTION_SUCCEEDED: { isConnected: boolean };
  readonly NETWORK__CHECK_CONNECTION_FAILED: ErrorBag;
  readonly NETWORK__OBSERVE_CONNECTION_CHANGE: null;
  readonly NETWORK__OBSERVING_CONNECTION_CHANGE: null;
  readonly NETWORK__OBSERVE_CONNECTION_CHANGE_FAILED: ErrorBag;
  readonly NETWORK__CANCEL_OBSERVING_CONNECTION_CHANGE: null;
  readonly NETWORK__CONNECTION_CHANGED: { isConnected: boolean };

  readonly QUIZ__FETCH_VOCABULARY_FOR_WRITING: {
    setId: string;
    vocabularyPool: 'learned' | 'active';
    limit: number;
    selectedCategoryNames: undefined | string[];
  };
  readonly QUIZ__FETCHING_VOCABULARY_FOR_WRITING: { setId: string };
  readonly QUIZ__FETCH_VOCABULARY_FOR_WRITING_SUCCEEDED: {
    setId: string;
    vocabularyList: readonly Vocabulary[];
  };
  readonly QUIZ__FETCH_VOCABULARY_FOR_WRITING_FAILED: ErrorBag & {
    setId: string;
  };
  readonly QUIZ__FETCH_VOCABULARY_FOR_MULTIPLE_CHOICE: {
    setId: string;
    vocabularyPool: 'learned' | 'active';
    limit: number;
    selectedCategoryNames: undefined | string[];
  };
  readonly QUIZ__FETCHING_VOCABULARY_FOR_MULTIPLE_CHOICE: { setId: string };
  readonly QUIZ__FETCH_VOCABULARY_FOR_MULTIPLE_CHOICE_SUCCEEDED: {
    setId: string;
    vocabularyList: readonly Vocabulary[];
  };
  readonly QUIZ__FETCH_VOCABULARY_FOR_MULTIPLE_CHOICE_FAILED: ErrorBag & {
    setId: string;
  };

  readonly REFLEX__PREPARE_FETCH_VOCABULARY: {
    setId: string;
    selectedCategoryNames: undefined | string[];
  };
  readonly REFLEX__PREPARING_FETCH_VOCABULARY: null;
  readonly REFLEX__PREPARE_FETCH_VOCABULARY_SUCCEEDED: null;
  readonly REFLEX__PREPARE_FETCH_VOCABULARY_FAILED: ErrorBag;
  readonly REFLEX__FETCH_VOCABULARY: null;
  readonly REFLEX__FETCHING_VOCABULARY: null;
  readonly REFLEX__FETCH_VOCABULARY_SUCCEEDED: {
    vocabularyList: readonly Vocabulary[];
    noMore: boolean;
  };
  readonly REFLEX__FETCH_VOCABULARY_FAILED: ErrorBag;
  readonly REFLEX__CLEAR_FETCH_VOCABULARY: null;

  readonly REMOTE_CONFIG__FETCH: null;
  readonly REMOTE_CONFIG__FETCHING: null;
  readonly REMOTE_CONFIG__FETCH_SUCCEEDED: { remoteConfig: RemoteConfig };
  readonly REMOTE_CONFIG__FETCH_FAILED: ErrorBag;
  readonly REMOTE_CONFIG__UPDATE: null;
  readonly REMOTE_CONFIG__UPDATING: null;
  readonly REMOTE_CONFIG__UPDATE_SUCCEEDED: null;
  readonly REMOTE_CONFIG__UPDATE_FAILED: ErrorBag;

  readonly ROOT__FORK_PROTECTED_SAGAS: {
    userId: string;
    accessToken: string;
    remoteConfig: RemoteConfig;
  };
  readonly ROOT__FORKING_PROTECTED_SAGAS: null;
  readonly ROOT__FORK_PROTECTED_SAGAS_SUCCEEDED: null;
  readonly ROOT__FORK_PROTECTED_SAGAS_FAILED: ErrorBag;
  readonly ROOT__CANCEL_PROTECTED_SAGAS: null;
  readonly ROOT__CANCELLING_PROTECTED_SAGAS: null;
  readonly ROOT__CANCEL_PROTECTED_SAGAS_SUCCEEDED: null;
  readonly ROOT__CANCEL_PROTECTED_SAGAS_FAILED: ErrorBag;
  readonly ROOT__RESET_ROOT_STATE: null;

  readonly SEARCH__PREPARE_SEARCH: { setId: string; searchTerm: string };
  readonly SEARCH__PREPARING_SEARCH: null;
  readonly SEARCH__PREPARE_SEARCH_SUCCEEDED: null;
  readonly SEARCH__PREPARE_SEARCH_FAILED: ErrorBag;
  readonly SEARCH__SEARCH: null;
  readonly SEARCH__SEARCHING: null;
  readonly SEARCH__SEARCH_SUCCEEDED: {
    vocabularyList: readonly Vocabulary[];
    noMore: boolean;
  };
  readonly SEARCH__SEARCH_FAILED: ErrorBag;
  readonly SEARCH__CLEAR_SEARCH: null;
  readonly SEARCH__RESET: null;

  readonly SET__ADD: { set: Set };
  readonly SET__ADDING: { set: Set };
  readonly SET__ADD_SUCCEEDED: { set: Set };
  readonly SET__ADD_FAILED: ErrorBag & { set: Set };
  readonly SET__START_EDIT: { set: Set };
  readonly SET__CLEAR_EDIT: null;
  readonly SET__EDIT: { set: DeepPartial<Set> };
  readonly SET__EDITING: { set: DeepPartial<Set> };
  readonly SET__EDIT_SUCCEEDED: { set: Set };
  readonly SET__EDIT_FAILED: ErrorBag & { set: DeepPartial<Set> };
  readonly SET__FETCH_ALL: null;
  readonly SET__FETCHING_ALL: null;
  readonly SET__FETCH_ALL_SUCCEEDED: { setList: readonly Set[] };
  readonly SET__FETCH_ALL_FAILED: ErrorBag;
  readonly SET__FETCH: { setStatus: SetStatus };
  readonly SET__FETCHING: { setStatus: SetStatus };
  readonly SET__FETCH_SUCCEEDED: {
    setList: readonly Set[];
    setStatus: SetStatus;
  };
  readonly SET__FETCH_FAILED: ErrorBag & { setStatus: SetStatus };
  readonly SET__SELECT: { setId: string };
  readonly SET__UPLOADING_SETS: { setList: readonly DeepPartial<Set>[] };
  readonly SET__UPLOAD_SETS_SUCCEEDED: { noMore: boolean };
  readonly SET__UPLOAD_SETS_FAILED: ErrorBag;
  readonly SET__DOWNLOADING_SETS: { startAt: null | Date };
  readonly SET__DOWNLOAD_SETS_SUCCEEDED: {
    setList: readonly Set[];
    noMore: boolean;
  };
  readonly SET__DOWNLOAD_SETS_FAILED: ErrorBag;
  readonly SET__DOWNLOADING_INCOMPATIBLE_SETS: null;
  readonly SET__DOWNLOAD_INCOMPATIBLE_SETS_SUCCEEDED: {
    setList: readonly Set[];
  };
  readonly SET__DOWNLOAD_INCOMPATIBLE_SETS_FAILED: ErrorBag;
  readonly SET__HAS_REMOTE_UPDATE: null;
  readonly SET__RECEIVE_REMOTE_UPDATE: { set: Set };

  readonly SPACED_REPETITION__FETCH_VOCABULARY: {
    setId: string;
    initialInterval: number;
    limit: number;
    selectedCategoryNames: undefined | string[];
    includeFromOtherCategories: undefined | boolean;
  };
  readonly SPACED_REPETITION__FETCHING_VOCABULARY: { setId: string };
  readonly SPACED_REPETITION__FETCH_VOCABULARY_SUCCEEDED: {
    setId: string;
    vocabularyList: readonly Vocabulary[];
  };
  readonly SPACED_REPETITION__FETCH_VOCABULARY_FAILED: ErrorBag & {
    setId: string;
  };
  readonly SPACED_REPETITION__SAVE_RESULT: {
    vocabularyList: ReadonlyMap<string, Vocabulary>;
    feedbackList: ReadonlyMap<string, Feedback>;
    autoArchiveSettings: AutoArchiveSettings;
  };
  readonly SPACED_REPETITION__SAVING_RESULT: null;
  readonly SPACED_REPETITION__SAVE_RESULT_SUCCEEDED: null;
  readonly SPACED_REPETITION__SAVE_RESULT_FAILED: ErrorBag;
  readonly SPACED_REPETITION__CLEAR_LESSON: null;

  readonly SYNC__OBSERVE_LOCAL_UPDATES_FOR_SYNCING: { addUploadTasks: boolean };
  readonly SYNC__OBSERVING_LOCAL_UPDATES_FOR_SYNCING: null;
  readonly SYNC__OBSERVE_LOCAL_UPDATES_FOR_SYNCING_FAILED: ErrorBag;
  readonly SYNC__OBSERVE_REMOTE_UPDATES_FOR_SYNCING: null;
  readonly SYNC__OBSERVING_REMOTE_UPDATES_FOR_SYNCING: null;
  readonly SYNC__OBSERVE_REMOTE_UPDATES_FOR_SYNCING_FAILED: ErrorBag;
  readonly SYNC__ADD_SYNC_TASK: { syncTask: SyncTask };
  readonly SYNC__SYNCING: null;
  readonly SYNC__SYNC_COMPLETED: null;
  readonly SYNC__STOP: null;

  readonly TRANSLATION__TRANSLATE: {
    sourceText: string;
    sourceLanguageCode: string;
    translatedToLanguageCode: string;
    translator: string;
  };
  readonly TRANSLATION__TRANSLATING: null;
  readonly TRANSLATION__TRANSLATE_SUCCEEDED: {
    translations: readonly Translation[];
  };
  readonly TRANSLATION__TRANSLATE_FAILED: ErrorBag & {
    sourceText: string;
    translator: string;
  };
  readonly TRANSLATION__TRANSLATE_BIDIRECTION: {
    languageCodePair: string;
    sourceText: string;
  };
  readonly TRANSLATION__CLEAR_TRANSLATIONS: null;
  readonly TRANSLATION__TRANSLATING_BIDIRECTION: null;
  readonly TRANSLATION__TRANSLATE_BIDIRECTION_SUCCEEDED: {
    translations: readonly TranslationWithLanguages[];
  };
  readonly TRANSLATION__TRANSLATE_BIDIRECTION_FAILED: ErrorBag;
  readonly TRANSLATION__CLEAR_BIDIRECTIONAL_TRANSLATIONS: null;

  readonly USER__GET_SESSION: null;
  readonly USER__GETTING_SESSION: null;
  readonly USER__GET_SESSION_SUCCEEDED: { user: null | User };
  readonly USER__GET_SESSION_FAILED: ErrorBag;
  readonly USER__CHECK_SESSION: null;
  readonly USER__CHECKING_SESSION: null;
  readonly USER__CHECK_SESSION_SUCCEEDED: { valid: boolean };
  readonly USER__CHECK_SESSION_FAILED: ErrorBag;
  readonly USER__SIGN_IN: { email: string; password: string };
  readonly USER__SIGNING_IN: null;
  readonly USER__SIGN_IN_SUCCEEDED: { user: User };
  readonly USER__SIGN_IN_FAILED: ErrorBag;
  readonly USER__SIGN_IN_AS_GUEST: null;
  readonly USER__SIGNING_IN_AS_GUEST: null;
  readonly USER__SIGN_IN_AS_GUEST_SUCCEEDED: { user: User };
  readonly USER__SIGN_IN_AS_GUEST_FAILED: ErrorBag;
  readonly USER__SIGN_UP: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  readonly USER__SIGNING_UP: null;
  readonly USER__SIGN_UP_SUCCEEDED: { user: User };
  readonly USER__SIGN_UP_FAILED: ErrorBag;
  readonly USER__SIGN_OUT: null;
  readonly USER__SIGNING_OUT: null;
  readonly USER__SIGN_OUT_SUCCEEDED: null;
  readonly USER__SIGN_OUT_FAILED: ErrorBag;
  readonly USER__REQUEST_PASSWORD_RESET_EMAIL: { email: string };
  readonly USER__REQUESTING_PASSWORD_RESET_EMAIL: null;
  readonly USER__REQUEST_PASSWORD_RESET_EMAIL_SUCCEEDED: null;
  readonly USER__REQUEST_PASSWORD_RESET_EMAIL_FAILED: ErrorBag;
  readonly USER__CHANGE_EMAIL_AND_PASSWORD: {
    newEmail: string;
    newPassword: string;
    confirmPassword: string;
    currentPassword: string;
  };
  readonly USER__CHANGING_EMAIL_AND_PASSWORD: null;
  readonly USER__CHANGE_EMAIL_AND_PASSWORD_SUCCEEDED: { newEmail: string };
  readonly USER__CHANGE_EMAIL_AND_PASSWORD_FAILED: ErrorBag;
  readonly USER__CHANGE_EMAIL: { newEmail: string; currentPassword: string };
  readonly USER__CHANGING_EMAIL: null;
  readonly USER__CHANGE_EMAIL_SUCCEEDED: { newEmail: string };
  readonly USER__CHANGE_EMAIL_FAILED: ErrorBag;
  readonly USER__CHANGE_PASSWORD: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  readonly USER__CHANGING_PASSWORD: null;
  readonly USER__CHANGE_PASSWORD_SUCCEEDED: null;
  readonly USER__CHANGE_PASSWORD_FAILED: ErrorBag;
  readonly USER__EDIT: {
    user: DeepPartial<User>;
  };
  readonly USER__EDITING: null;
  readonly USER__EDIT_SUCCEEDED: { user: User };
  readonly USER__EDIT_FAILED: ErrorBag;
  readonly USER__FETCH: null;
  readonly USER__FETCHING: null;
  readonly USER__FETCH_SUCCEEDED: { user: User };
  readonly USER__FETCH_FAILED: ErrorBag;
  readonly USER__UPLOADING_USER: { user: null | DeepPartial<User> };
  readonly USER__UPLOAD_USER_SUCCEEDED: { noMore: boolean };
  readonly USER__UPLOAD_USER_FAILED: ErrorBag;
  readonly USER__DOWNLOADING_USER: null;
  readonly USER__DOWNLOAD_USER_SUCCEEDED: null;
  readonly USER__DOWNLOAD_USER_FAILED: ErrorBag;
  readonly USER__CONTACT_ADMIN: {
    adminEmail: string;
    replyToEmail: string;
    subject: string;
    message: string;
  };
  readonly USER__CONTACTING_ADMIN: null;
  readonly USER__CONTACT_ADMIN_SUCCEEDED: null;
  readonly USER__CONTACT_ADMIN_FAILED: ErrorBag;

  readonly VOCABULARY__ADD: { vocabulary: Vocabulary; setId: string };
  readonly VOCABULARY__ADDING: { vocabulary: Vocabulary };
  readonly VOCABULARY__ADD_SUCCEEDED: { vocabulary: Vocabulary };
  readonly VOCABULARY__ADD_FAILED: ErrorBag & {
    vocabulary: Vocabulary;
  };
  readonly VOCABULARY__ADD_MULTIPLE: {
    vocabularyList: readonly Vocabulary[];
    setId: string;
  };
  readonly VOCABULARY__ADDING_MULTIPLE: {
    vocabularyList: readonly Vocabulary[];
  };
  readonly VOCABULARY__ADD_MULTIPLE_SUCCEEDED: {
    vocabularyList: readonly Vocabulary[];
  };
  readonly VOCABULARY__ADD_MULTIPLE_FAILED: ErrorBag & {
    vocabularyList: readonly Vocabulary[];
  };
  readonly VOCABULARY__START_EDIT: { vocabulary: Vocabulary };
  readonly VOCABULARY__CLEAR_EDIT: null;
  readonly VOCABULARY__EDIT: {
    vocabulary: DeepPartial<Vocabulary>;
    setId: undefined | string;
  };
  readonly VOCABULARY__EDITING: { vocabulary: DeepPartial<Vocabulary> };
  readonly VOCABULARY__EDIT_SUCCEEDED: {
    vocabulary: Vocabulary;
    setId: undefined | string;
  };
  readonly VOCABULARY__EDIT_FAILED: ErrorBag & {
    vocabulary: DeepPartial<Vocabulary>;
  };
  readonly VOCABULARY__EDIT_MULTIPLE: {
    vocabularyList: readonly DeepPartial<Vocabulary>[];
    vocabularyIdSetIdPairs: readonly [string, string][];
  };
  readonly VOCABULARY__EDITING_MULTIPLE: {
    vocabularyList: readonly DeepPartial<Vocabulary>[];
  };
  readonly VOCABULARY__EDIT_MULTIPLE_SUCCEEDED: null;
  readonly VOCABULARY__EDIT_MULTIPLE_FAILED: ErrorBag & {
    vocabularyList: readonly DeepPartial<Vocabulary>[];
  };
  readonly VOCABULARY__UPLOADING_VOCABULARY: {
    vocabularyList: readonly DeepPartial<Vocabulary>[];
  };
  readonly VOCABULARY__UPLOAD_VOCABULARY_SUCCEEDED: { noMore: boolean };
  readonly VOCABULARY__UPLOAD_VOCABULARY_FAILED: ErrorBag;
  readonly VOCABULARY__DOWNLOADING_VOCABULARY: { startAt: null | Date };
  readonly VOCABULARY__DOWNLOAD_VOCABULARY_SUCCEEDED: {
    vocabularyList: readonly Vocabulary[];
    noMore: boolean;
  };
  readonly VOCABULARY__DOWNLOAD_VOCABULARY_FAILED: ErrorBag;
  readonly VOCABULARY__DOWNLOADING_INCOMPATIBLE_VOCABULARY: null;
  readonly VOCABULARY__DOWNLOAD_INCOMPATIBLE_VOCABULARY_SUCCEEDED: {
    vocabularyList: readonly Vocabulary[];
  };
  readonly VOCABULARY__DOWNLOAD_INCOMPATIBLE_VOCABULARY_FAILED: ErrorBag;
  readonly VOCABULARY__PREPARE_FETCH:
  | {
    filterBy: 'VocabularyStatus';
    setId: string;
    vocabularyStatus: VocabularyStatus;
    categoryName?: string;
  }
  | {
    filterBy: 'VocabularyDueType';
    setId: string;
    initialInterval: number;
    dueType: VocabularyDueType;
    categoryName?: string;
  };
  readonly VOCABULARY__PREPARING_FETCH: null;
  readonly VOCABULARY__PREPARE_FETCH_SUCCEEDED: null;
  readonly VOCABULARY__PREPARE_FETCH_FAILED: ErrorBag;
  readonly VOCABULARY__FETCH: null;
  readonly VOCABULARY__FETCHING: null;
  readonly VOCABULARY__FETCH_SUCCEEDED: {
    vocabularyList: readonly Vocabulary[];
    noMore: boolean;
  };
  readonly VOCABULARY__FETCH_FAILED: ErrorBag;
  readonly VOCABULARY__CLEAR_FETCH: null;

  readonly WRITING__FETCH_VOCABULARY: {
    setId: string;
    initialInterval: number;
    limit: number;
    selectedCategoryNames: undefined | string[];
    includeFromOtherCategories: undefined | boolean;
  };
  readonly WRITING__FETCHING_VOCABULARY: { setId: string };
  readonly WRITING__FETCH_VOCABULARY_SUCCEEDED: {
    setId: string;
    vocabularyList: readonly Vocabulary[];
  };
  readonly WRITING__FETCH_VOCABULARY_FAILED: ErrorBag & {
    setId: string;
  };
  readonly WRITING__SAVE_RESULT: {
    vocabularyList: ReadonlyMap<string, Vocabulary>;
    feedbackList: ReadonlyMap<string, Feedback>;
    autoArchiveSettings: AutoArchiveSettings;
  };
  readonly WRITING__SAVING_RESULT: null;
  readonly WRITING__SAVE_RESULT_SUCCEEDED: null;
  readonly WRITING__SAVE_RESULT_FAILED: ErrorBag;
  readonly WRITING__CLEAR_LESSON: null;

  readonly FLASHCARD_PLAYER__UPLOAD: {
    playerUrl: string;
    setId: string;
    languagePair: string;
    selectedCategoryNames: undefined | string[];
  };
  readonly FLASHCARD_PLAYER__UPLOADING: null;
  readonly FLASHCARD_PLAYER__UPLOAD_SUCCEEDED: { playlistId: string };
  readonly FLASHCARD_PLAYER__UPLOAD_FAILED: ErrorBag;

  readonly IMAGE__PREPARE_SEARCH_IMAGES: {
    q: string;
    image_type: string;
    safesearch: boolean;
  };
  readonly IMAGE__PREPARING_SEARCH_IMAGES: null;
  readonly IMAGE__PREPARE_SEARCH_IMAGES_SUCCEEDED: null;
  readonly IMAGE__PREPARE_SEARCH_IMAGES_FAILED: ErrorBag;
  readonly IMAGE__SEARCH_IMAGES: {};
  readonly IMAGE__SEARCHING_IMAGES: null;
  readonly IMAGE__SEARCH_IMAGES_SUCCEEDED: {
    images: PixabayImage[];
    noMore: boolean;
  };
  readonly IMAGE__SEARCH_IMAGES_FAILED: ErrorBag;
  readonly IMAGE__CLEAR_SEARCH_IMAGES_FAILED: null;
  readonly IMAGE__UPLOAD_IMAGES: { images: PixabayImage[] };
  readonly IMAGE__UPLOADING_IMAGES: null;
  readonly IMAGE__UPLOAD_IMAGES_SUCCEEDED: {
    urls: string[];
  };
  readonly IMAGE__UPLOAD_IMAGES_FAILED: ErrorBag;

  readonly REMINDER__CHECK_PERMISSION: null;
  readonly REMINDER__CHECKING_PERMISSION: null;
  readonly REMINDER__CHECK_PERMISSION_SUCCEEDED: { hasPermission: boolean };
  readonly REMINDER__CHECK_PERMISSION_FAILED: ErrorBag;
  readonly REMINDER__REQUEST_PERMISSION: null;
  readonly REMINDER__REQUESTING_PERMISSION: null;
  readonly REMINDER__REQUEST_PERMISSION_SUCCEEDED: null;
  readonly REMINDER__REQUEST_PERMISSION_FAILED: ErrorBag;
  readonly REMINDER__SET_UP_REMINDER: { hours: number; minutes: number };
  readonly REMINDER__SETTING_UP_REMINDER: null;
  readonly REMINDER__SET_UP_REMINDER_SUCCEEDED: null;
  readonly REMINDER__SET_UP_REMINDER_FAILED: ErrorBag;
  readonly REMINDER__DELETE_REMINDER: null;
  readonly REMINDER__DELETING_REMINDER: null;
  readonly REMINDER__DELETE_REMINDER_SUCCEEDED: null;
  readonly REMINDER__DELETE_REMINDER_FAILED: ErrorBag;

  readonly THEME__SYSTEM_MODE_CHANGED: { systemMode: Theme };
}
