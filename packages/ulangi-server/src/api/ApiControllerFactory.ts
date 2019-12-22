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
import { GetPublicSetCountController } from './controllers/GetPublicSetCountController';
import { GetRemoteConfigController } from './controllers/GetRemoteConfigController';
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
import { UploadPixabayImagesController } from './controllers/UploadPixabayImagesController';
import { UploadSetsController } from './controllers/UploadSetsController';
import { UploadUserController } from './controllers/UploadUserController';
import { UploadVocabularyController } from './controllers/UploadVocabularyController';

export class ApiControllerFactory {
  private authenticator: AuthenticatorFacade;
  private database: DatabaseFacade;
  private firebase: FirebaseFacade;
  private dictionary: DictionaryFacade;
  private library: LibraryFacade;
  private remoteConfig: RemoteConfigFacade;
  private googleTranslate: GoogleTranslateAdapter;
  private googleTextToSpeech: GoogleTextToSpeechAdapter;
  private mailer: MailerAdapter;
  private iap: IapAdapter;
  private imageUploader: ImageUploaderAdapter;
  private modelList: ModelList;
  private env: Env;
  private config: Config;

  public constructor(
    authenticator: AuthenticatorFacade,
    database: DatabaseFacade,
    firebase: FirebaseFacade,
    dictionary: DictionaryFacade,
    library: LibraryFacade,
    remoteConfig: RemoteConfigFacade,
    googleTranslate: GoogleTranslateAdapter,
    googleTextToSpeech: GoogleTextToSpeechAdapter,
    mailer: MailerAdapter,
    iap: IapAdapter,
    imageUploader: ImageUploaderAdapter,
    modelList: ModelList,
    env: Env,
    config: Config
  ) {
    this.authenticator = authenticator;
    this.database = database;
    this.firebase = firebase;
    this.dictionary = dictionary;
    this.library = library;
    this.remoteConfig = remoteConfig;
    this.googleTranslate = googleTranslate;
    this.googleTextToSpeech = googleTextToSpeech;
    this.mailer = mailer;
    this.iap = iap;
    this.imageUploader = imageUploader;
    this.modelList = modelList;
    this.env = env;
    this.config = config;
  }

  public makeControllers(): readonly ApiController<any, any>[] {
    return [
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

      new DeleteApiKeyController(this.database, this.modelList.apiKeyModel),

      new GetApiKeyController(
        this.authenticator,
        this.database,
        this.modelList.apiKeyModel
      ),

      new GetRemoteConfigController(this.remoteConfig),

      new GetFirebaseTokenController(this.firebase),

      new GetDictionaryEntryController(this.dictionary),

      new GetPublicSetCountController(this.library),

      new SynthesizeSpeechController(this.googleTextToSpeech, this.config),

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

      new RequestPasswordResetController(
        this.authenticator,
        this.database,
        this.mailer,
        this.modelList.userModel,
        this.modelList.resetPasswordModel,
        this.env,
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

      new ContactAdminController(this.mailer),

      new TranslateController(this.googleTranslate),

      new TranslateBidirectionController(this.googleTranslate),

      new SearchNativeSetsController(this.library, this.config),

      new SearchNativeVocabularyController(this.library, this.config),

      new SearchPublicSetsController(this.library, this.config),

      new SearchPublicVocabularyController(this.library, this.config),

      new SendApiKeyController(this.mailer),

      new ProcessPurchaseController(
        this.iap,
        this.database,
        this.firebase,
        this.modelList.purchaseModel
      ),

      new SearchPixabayImagesController(this.config),

      new UploadPixabayImagesController(this.imageUploader, this.config),
    ];
  }
}
