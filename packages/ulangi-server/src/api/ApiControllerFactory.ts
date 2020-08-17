/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DictionaryFacade } from '@ulangi/ulangi-dictionary';
import { LibraryFacade } from '@ulangi/ulangi-library';
import { DatabaseFacade, ModelList } from '@ulangi/ulangi-remote-database';

import { GoogleTextToSpeechAdapter } from '../adapters/GoogleTextToSpeechAdapter';
import { GoogleTranslateAdapter } from '../adapters/GoogleTranslateAdapter';
import { IapAdapter } from '../adapters/IapAdapter';
import { ImageUploaderAdapter } from '../adapters/ImageUploaderAdapter';
import { MailerAdapter } from '../adapters/MailerAdapter';
import { AuthenticatorFacade } from '../facades/AuthenticatorFacade';
import { FirebaseFacade } from '../facades/FirebaseFacade';
import { RemoteConfigFacade } from '../facades/RemoteConfigFacade';
import { Config } from '../interfaces/Config';
import { Env } from '../interfaces/Env';
import { ApiController } from './controllers/ApiController';
import { ChangeEmailAndPasswordController } from './controllers/ChangeEmailAndPasswordController';
import { ChangeEmailController } from './controllers/ChangeEmailController';
import { ChangePasswordController } from './controllers/ChangePasswordController';
import { CheckAccessTokenController } from './controllers/CheckAccessTokenController';
import { ContactAdminController } from './controllers/ContactAdminController';
import { DeleteApiKeyController } from './controllers/DeleteApiKeyController';
import { DownloadSetsController } from './controllers/DownloadSetsController';
import { DownloadSpecificSetsController } from './controllers/DownloadSpecificSetsController';
import { DownloadSpecificVocabularyController } from './controllers/DownloadSpecificVocabularyController';
import { DownloadUserController } from './controllers/DownloadUserController';
import { DownloadVocabularyController } from './controllers/DownloadVocabularyController';
import { GetApiKeyController } from './controllers/GetApiKeyController';
import { GetDictionaryEntryController } from './controllers/GetDictionaryEntryController';
import { GetFirebaseTokenController } from './controllers/GetFirebaseTokenController';
import { GetHeatMapDataController } from './controllers/GetHeatMapDataController';
import { GetPublicSetCountController } from './controllers/GetPublicSetCountController';
import { GetRemoteConfigController } from './controllers/GetRemoteConfigController';
import { GetStatisticsController } from './controllers/GetStatisticsController';
import { ProcessPurchaseController } from './controllers/ProcessPurchaseController';
import { RequestPasswordResetController } from './controllers/RequestPasswordResetController';
import { ResetPasswordController } from './controllers/ResetPasswordController';
import { SearchNativeSetsController } from './controllers/SearchNativeSetsController';
import { SearchNativeVocabularyController } from './controllers/SearchNativeVocabularyController';
import { SearchPixabayImagesController } from './controllers/SearchPixabayImagesController';
import { SearchPublicSetsController } from './controllers/SearchPublicSetsController';
import { SearchPublicVocabularyController } from './controllers/SearchPublicVocabularyController';
import { SendApiKeyController } from './controllers/SendApiKeyController';
import { SignInController } from './controllers/SignInController';
import { SignUpController } from './controllers/SignUpController';
import { SynthesizeSpeechController } from './controllers/SynthesizeSpeechController';
import { TranslateBidirectionController } from './controllers/TranslateBidirectionController';
import { TranslateController } from './controllers/TranslateController';
import { UploadLessonResultsController } from './controllers/UploadLessonResultsController';
import { UploadPixabayImagesController } from './controllers/UploadPixabayImagesController';
import { UploadSetsController } from './controllers/UploadSetsController';
import { UploadUserController } from './controllers/UploadUserController';
import { UploadVocabularyController } from './controllers/UploadVocabularyController';

export class ApiControllerFactory {
  private authenticator: AuthenticatorFacade;
  private database: DatabaseFacade;
  private remoteConfig: RemoteConfigFacade;
  private modelList: ModelList;
  private env: Env;
  private config: Config;

  private firebase: null | FirebaseFacade;
  private dictionary: null | DictionaryFacade;
  private library: null | LibraryFacade;
  private googleTranslate: null | GoogleTranslateAdapter;
  private googleTextToSpeech: null | GoogleTextToSpeechAdapter;
  private mailer: null | MailerAdapter;
  private iap: null | IapAdapter;
  private imageUploader: null | ImageUploaderAdapter;

  public constructor(
    authenticator: AuthenticatorFacade,
    database: DatabaseFacade,
    remoteConfig: RemoteConfigFacade,
    modelList: ModelList,
    env: Env,
    config: Config,
    firebase: null | FirebaseFacade,
    dictionary: null | DictionaryFacade,
    library: null | LibraryFacade,
    googleTranslate: null | GoogleTranslateAdapter,
    googleTextToSpeech: null | GoogleTextToSpeechAdapter,
    mailer: null | MailerAdapter,
    iap: null | IapAdapter,
    imageUploader: null | ImageUploaderAdapter
  ) {
    this.authenticator = authenticator;
    this.database = database;
    this.remoteConfig = remoteConfig;
    this.modelList = modelList;
    this.env = env;
    this.config = config;
    this.firebase = firebase;
    this.dictionary = dictionary;
    this.library = library;
    this.googleTranslate = googleTranslate;
    this.googleTextToSpeech = googleTextToSpeech;
    this.mailer = mailer;
    this.iap = iap;
    this.imageUploader = imageUploader;
  }

  public makeControllers(): readonly ApiController<any, any>[] {
    return [
      ...this.makeDefaultControllers(),
      ...this.makeOptionalControllers(),
    ];
  }

  private makeDefaultControllers(): readonly ApiController<any, any>[] {
    const controllers: ApiController<any, any>[] = [
      new ChangeEmailAndPasswordController(
        this.authenticator,
        this.database,
        this.firebase,
        this.modelList.userModel,
        this.config
      ),

      new ChangeEmailController(
        this.authenticator,
        this.database,
        this.firebase,
        this.modelList.userModel
      ),

      new ChangePasswordController(
        this.authenticator,
        this.database,
        this.modelList.userModel,
        this.config
      ),

      new SignInController(
        this.authenticator,
        this.database,
        this.modelList.userModel
      ),

      new SignUpController(
        this.authenticator,
        this.database,
        this.modelList.userModel,
        this.config
      ),

      new ResetPasswordController(
        this.authenticator,
        this.database,
        this.modelList.userModel,
        this.modelList.resetPasswordModel,
        this.config
      ),

      new CheckAccessTokenController(this.authenticator),

      new DeleteApiKeyController(this.database, this.modelList.apiKeyModel),

      new GetApiKeyController(
        this.authenticator,
        this.database,
        this.modelList.apiKeyModel
      ),

      new GetRemoteConfigController(this.remoteConfig),

      new GetStatisticsController(
        this.database,
        this.modelList.lessonResultModel
      ),

      new GetHeatMapDataController(
        this.database,
        this.modelList.lessonResultModel
      ),

      new UploadLessonResultsController(
        this.database,
        this.modelList.lessonResultModel
      ),

      new DownloadUserController(this.database, this.modelList.userModel),

      new DownloadSetsController(this.database, this.modelList.setModel),

      new DownloadSpecificSetsController(
        this.database,
        this.modelList.setModel
      ),

      new DownloadVocabularyController(
        this.database,
        this.modelList.vocabularyModel
      ),

      new DownloadSpecificVocabularyController(
        this.database,
        this.modelList.vocabularyModel
      ),

      new UploadUserController(
        this.database,
        this.firebase,
        this.modelList.userModel
      ),

      new UploadSetsController(
        this.database,
        this.firebase,
        this.modelList.setModel
      ),

      new UploadVocabularyController(
        this.database,
        this.firebase,
        this.modelList.vocabularyModel,
        this.modelList.setModel
      ),

      new SearchPixabayImagesController(this.config),
    ];

    return controllers;
  }

  // These are the controllers only work if respective services are enabled
  private makeOptionalControllers(): readonly ApiController<any, any>[] {
    const controllers: ApiController<any, any>[] = [];

    if (this.firebase !== null) {
      controllers.push(new GetFirebaseTokenController(this.firebase));
    }

    if (this.dictionary !== null) {
      controllers.push(new GetDictionaryEntryController(this.dictionary));
    }

    if (this.library !== null && this.googleTranslate !== null) {
      controllers.push(
        new GetPublicSetCountController(this.library),
        new SearchNativeSetsController(this.library, this.config),
        new SearchNativeVocabularyController(this.library, this.config),
        new SearchPublicSetsController(this.library, this.config),
        new SearchPublicVocabularyController(
          this.library,
          this.googleTranslate,
          this.config
        )
      );
    }

    if (this.googleTranslate !== null) {
      controllers.push(
        new TranslateController(this.googleTranslate),
        new TranslateBidirectionController(this.googleTranslate)
      );
    }

    if (this.googleTextToSpeech !== null) {
      controllers.push(
        new SynthesizeSpeechController(this.googleTextToSpeech, this.config)
      );
    }

    if (this.mailer !== null) {
      controllers.push(
        new RequestPasswordResetController(
          this.authenticator,
          this.database,
          this.mailer,
          this.modelList.userModel,
          this.modelList.resetPasswordModel,
          this.env,
          this.config
        ),
        new ContactAdminController(this.mailer),
        new SendApiKeyController(this.mailer)
      );
    }

    if (this.iap !== null) {
      controllers.push(
        new ProcessPurchaseController(
          this.iap,
          this.database,
          this.firebase,
          this.modelList.purchaseModel
        )
      );
    }

    if (this.imageUploader !== null) {
      controllers.push(
        new UploadPixabayImagesController(this.imageUploader, this.config)
      );
    }

    return controllers;
  }
}
