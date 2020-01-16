/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { DatabaseEventBus, ModelList } from '@ulangi/ulangi-local-database';
import * as FileSystem from 'react-native-fs';
import * as Iap from 'react-native-iap';

import { AudioPlayerAdapter } from '../adapters/AudioPlayerAdapter';
import { FirebaseAdapter } from '../adapters/FirebaseAdapter';
import { NotificationsAdapter } from '../adapters/NotificationsAdapter';
import { ApiKeySaga } from '../sagas/ApiKeySaga';
import { AtomSaga } from '../sagas/AtomSaga';
import { AudioSaga } from '../sagas/AudioSaga';
import { CategorySaga } from '../sagas/CategorySaga';
import { DictionarySaga } from '../sagas/DictionarySaga';
import { DownloadIncompatibleSetSaga } from '../sagas/DownloadIncompatibleSetSaga';
import { DownloadIncompatibleVocabularySaga } from '../sagas/DownloadIncompatibleVocabularySaga';
import { DownloadSetSaga } from '../sagas/DownloadSetSaga';
import { DownloadUserSaga } from '../sagas/DownloadUserSaga';
import { DownloadVocabularySaga } from '../sagas/DownloadVocabularySaga';
import { FlashcardPlayerSaga } from '../sagas/FlashcardPlayerSaga';
import { IapSaga } from '../sagas/IapSaga';
import { ImageSaga } from '../sagas/ImageSaga';
import { LibrarySaga } from '../sagas/LibrarySaga';
import { ManageSaga } from '../sagas/ManageSaga';
import { ObserveUpdateSaga } from '../sagas/ObserveUpdateSaga';
import { ProtectedSaga } from '../sagas/ProtectedSaga';
import { QuizSaga } from '../sagas/QuizSaga';
import { ReflexSaga } from '../sagas/ReflexSaga';
import { ReminderSaga } from '../sagas/ReminderSaga';
import { SearchSaga } from '../sagas/SearchSaga';
import { SetSaga } from '../sagas/SetSaga';
import { SpacedRepetitionSaga } from '../sagas/SpacedRepetitionSaga';
import { SyncSaga } from '../sagas/SyncSaga';
import { TranslationSaga } from '../sagas/TranslationSaga';
import { UploadSetSaga } from '../sagas/UploadSetSaga';
import { UploadUserSaga } from '../sagas/UploadUserSaga';
import { UploadVocabularySaga } from '../sagas/UploadVocabularySaga';
import { UserSaga } from '../sagas/UserSaga';
import { VocabularySaga } from '../sagas/VocabularySaga';
import { WritingSaga } from '../sagas/WritingSaga';

export class ProtectedSagaFactory {
  private sharedDb: SQLiteDatabase;
  private userDb: SQLiteDatabase;
  private firebase: FirebaseAdapter;
  private fileSystem: typeof FileSystem;
  private iap: typeof Iap;
  private audioPlayer: AudioPlayerAdapter;
  private notifications: NotificationsAdapter;
  private databaseEventBus: DatabaseEventBus;
  private modelList: ModelList;

  public constructor(
    sharedDb: SQLiteDatabase,
    userDb: SQLiteDatabase,
    firebase: FirebaseAdapter,
    fileSystem: typeof FileSystem,
    iap: typeof Iap,
    audioPlayer: AudioPlayerAdapter,
    notifications: NotificationsAdapter,
    databaseEventBus: DatabaseEventBus,
    modelList: ModelList
  ) {
    this.sharedDb = sharedDb;
    this.userDb = userDb;
    this.firebase = firebase;
    this.fileSystem = fileSystem;
    this.iap = iap;
    this.audioPlayer = audioPlayer;
    this.notifications = notifications;
    this.databaseEventBus = databaseEventBus;
    this.modelList = modelList;
  }

  public createAllProtectedSagas(): readonly ProtectedSaga[] {
    return [
      new UserSaga(
        this.sharedDb,
        this.userDb,
        this.modelList.sessionModel,
        this.modelList.userModel
      ),
      new SetSaga(this.userDb, this.modelList.setModel),
      new VocabularySaga(
        this.userDb,
        this.modelList.vocabularyModel,
        this.modelList.spacedRepetitionModel,
        this.modelList.writingModel
      ),
      new CategorySaga(this.userDb, this.modelList.categoryModel),
      new ManageSaga(
        this.userDb,
        this.modelList.vocabularyModel,
        this.modelList.categoryModel,
        this.modelList.spacedRepetitionModel,
        this.modelList.writingModel
      ),
      new SearchSaga(this.userDb, this.modelList.vocabularyModel),
      new AudioSaga(
        this.sharedDb,
        this.modelList.sessionModel,
        this.fileSystem,
        this.audioPlayer
      ),
      new LibrarySaga(this.sharedDb, this.modelList.sessionModel),
      new SpacedRepetitionSaga(
        this.sharedDb,
        this.userDb,
        this.modelList.sessionModel,
        this.modelList.vocabularyModel,
        this.modelList.spacedRepetitionModel
      ),
      new WritingSaga(
        this.sharedDb,
        this.userDb,
        this.modelList.sessionModel,
        this.modelList.vocabularyModel,
        this.modelList.writingModel
      ),
      new QuizSaga(
        this.userDb,
        this.modelList.vocabularyModel,
        this.modelList.quizMultipleChoiceModel,
        this.modelList.quizWritingModel
      ),
      new ReflexSaga(this.userDb, this.modelList.vocabularyModel),
      new AtomSaga(this.userDb, this.modelList.vocabularyModel),
      new FlashcardPlayerSaga(this.userDb, this.modelList.vocabularyModel),
      new DictionarySaga(this.sharedDb, this.modelList.sessionModel),
      new TranslationSaga(this.sharedDb, this.modelList.sessionModel),
      new SyncSaga(
        new UploadUserSaga(
          this.userDb,
          this.sharedDb,
          this.modelList.sessionModel,
          this.modelList.dirtyUserModel
        ),
        new UploadSetSaga(
          this.userDb,
          this.sharedDb,
          this.modelList.sessionModel,
          this.modelList.dirtySetModel
        ),
        new UploadVocabularySaga(
          this.userDb,
          this.sharedDb,
          this.modelList.sessionModel,
          this.modelList.dirtyVocabularyModel
        ),
        new DownloadUserSaga(
          this.userDb,
          this.sharedDb,
          this.modelList.sessionModel,
          this.modelList.userModel
        ),
        new DownloadSetSaga(
          this.userDb,
          this.sharedDb,
          this.modelList.sessionModel,
          this.modelList.setModel,
          this.modelList.incompatibleSetModel
        ),
        new DownloadVocabularySaga(
          this.userDb,
          this.sharedDb,
          this.modelList.sessionModel,
          this.modelList.vocabularyModel,
          this.modelList.incompatibleVocabularyModel
        ),
        new DownloadIncompatibleSetSaga(
          this.userDb,
          this.sharedDb,
          this.modelList.sessionModel,
          this.modelList.setModel,
          this.modelList.incompatibleSetModel
        ),
        new DownloadIncompatibleVocabularySaga(
          this.userDb,
          this.sharedDb,
          this.modelList.sessionModel,
          this.modelList.vocabularyModel,
          this.modelList.incompatibleVocabularyModel
        )
      ),
      new ObserveUpdateSaga(
        this.sharedDb,
        this.modelList.sessionModel,
        this.firebase,
        this.databaseEventBus
      ),
      new ApiKeySaga(this.sharedDb, this.modelList.sessionModel),
      new IapSaga(this.sharedDb, this.modelList.sessionModel, this.iap),
      new ImageSaga(this.sharedDb, this.modelList.sessionModel),
      new ReminderSaga(this.notifications),
    ];
  }
}
