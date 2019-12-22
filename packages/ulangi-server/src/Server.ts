/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DictionaryFacade } from '@ulangi/ulangi-dictionary';
import { LibraryFacade } from '@ulangi/ulangi-library';
import {
  DatabaseFacade,
  ModelFactory,
  ModelList,
} from '@ulangi/ulangi-remote-database';
import * as appRoot from 'app-root-path';
import * as AWS from 'aws-sdk';
import chalk from 'chalk';
import * as express from 'express';
import * as passport from 'passport';
import * as path from 'path';

import { GoogleTextToSpeechAdapter } from './adapters/GoogleTextToSpeechAdapter';
import { GoogleTranslateAdapter } from './adapters/GoogleTranslateAdapter';
import { IapAdapter } from './adapters/IapAdapter';
import { ImageUploaderAdapter } from './adapters/ImageUploaderAdapter';
import { MailerAdapter } from './adapters/MailerAdapter';
import { PollyAdapter } from './adapters/PollyAdapter';
import { ApiControllerFactory } from './api/ApiControllerFactory';
import { ApiRouterFactory } from './api/ApiRouterFactory';
import { AuthenticatorFacade } from './facades/AuthenticatorFacade';
import { FirebaseFacade } from './facades/FirebaseFacade';
import { RemoteConfigFacade } from './facades/RemoteConfigFacade';
import { Config } from './interfaces/Config';
import { Env } from './interfaces/Env';
import { Logger, scope } from './logger/Logger';
import { loadConfig } from './setup/loadConfig';
import { resolveEnv } from './setup/resolveEnv';
import { setupAWS } from './setup/setupAWS';
import { WebControllerFactory } from './web/WebControllerFactory';
import { WebRouterFactory } from './web/WebRouterFactory';

export class Server {
  private logger: Logger;
  private config: Config;
  private env: Env;
  private authenticator: AuthenticatorFacade;
  private database: DatabaseFacade;
  private firebase: FirebaseFacade;
  private dictionary: DictionaryFacade;
  private library: LibraryFacade;
  private remoteConfig: RemoteConfigFacade;
  private googleTranslate: GoogleTranslateAdapter;
  private googleTextToSpeech: GoogleTextToSpeechAdapter;
  private polly: PollyAdapter;
  private iap: IapAdapter;
  private mailer: MailerAdapter;
  private imageUploader: ImageUploaderAdapter;
  private modelList: ModelList;

  private apiRouterFactory: ApiRouterFactory;
  private apiControllerFactory: ApiControllerFactory;
  private webRouterFactory: WebRouterFactory;
  private webControllerFactory: WebControllerFactory;

  public constructor() {
    this.config = loadConfig();
    this.env = resolveEnv();

    this.logger = new Logger(this.env.LOG_VERBOSITY);

    this.modelList = new ModelFactory().createAllModels();

    this.database = new DatabaseFacade(
      this.env.AUTH_DATABASE_CONFIG,
      this.env.ALL_SHARD_DATABASE_CONFIG,
      this.env.SHARD_DATABASE_NAME_PREFIX
    );
    this.firebase = new FirebaseFacade(
      this.env.FIREBASE_SERVICE_ACCOUNT_PATH,
      this.env.FIREBASE_DATABASE_URL,
      this.modelList.userModel,
      this.modelList.setModel,
      this.modelList.vocabularyModel
    );
    this.dictionary = new DictionaryFacade(
      this.env.DICTIONARY_SERVER_URL,
      AWS.config
    );
    this.library = new LibraryFacade(
      this.env.LIBRARY_SERVER_URL,
      this.dictionary,
      AWS.config
    );
    this.remoteConfig = new RemoteConfigFacade();
    this.googleTranslate = new GoogleTranslateAdapter(
      this.env.GOOGLE_CLOUD_PROJECT_ID,
      this.env.GOOGLE_CLOUD_SERVICE_ACCOUNT
    );
    this.googleTextToSpeech = new GoogleTextToSpeechAdapter(
      this.env.GOOGLE_CLOUD_PROJECT_ID,
      this.env.GOOGLE_CLOUD_SERVICE_ACCOUNT
    );
    this.iap = new IapAdapter(
      this.modelList.userModel,
      this.modelList.purchaseModel,
      this.env.PLAY_STORE_SERVICE_ACCOUNT,
      this.env.IOS_PREMIUM_LIFETIME_PRODUCT_ID,
      this.env.ANDROID_PREMIUM_LIFETIME_PRODUCT_ID
    );
    this.mailer = new MailerAdapter(
      new AWS.SES({ region: this.env.AWS_SES_REGION })
    );
    this.polly = new PollyAdapter(
      new AWS.Polly({ region: this.env.AWS_POLLY_REGION })
    );
    this.imageUploader = new ImageUploaderAdapter(new AWS.S3());
    this.authenticator = new AuthenticatorFacade(
      new passport.Passport(),
      this.database,
      this.modelList.userModel,
      this.modelList.resetPasswordModel,
      this.modelList.apiKeyModel,
      this.env.JWT_SECRET_KEY
    );

    this.apiControllerFactory = new ApiControllerFactory(
      this.authenticator,
      this.database,
      this.firebase,
      this.dictionary,
      this.library,
      this.remoteConfig,
      this.googleTranslate,
      this.googleTextToSpeech,
      this.mailer,
      this.iap,
      this.imageUploader,
      this.modelList,
      this.env,
      this.config
    );
    this.apiRouterFactory = new ApiRouterFactory(this.authenticator);

    this.webControllerFactory = new WebControllerFactory(this.env);
    this.webRouterFactory = new WebRouterFactory();
  }

  public async setup(): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          this.logger.info(scope('Server'), `starting...`);

          setupAWS(
            this.env.AWS_ACCESS_KEY_ID,
            this.env.AWS_SECRET_ACCESS_KEY,
            this.env.AWS_DEFAULT_REGION
          );

          this.logger.info(scope('Server'), `setting up in-app purchase...`);
          await this.iap.setup();

          this.logger.info(scope('Server'), `checking auth database...`);
          await this.database.checkAuthDatabaseTables();

          this.logger.info(scope('Server'), `checking all shard databases...`);
          await this.database.checkAllShardDatabaseTables();

          this.logger.info(
            scope('Server'),
            `checking connection to translators...`
          );
          await this.googleTranslate.checkTranslators();

          this.logger.info(
            scope('Server'),
            `prefetching dictionary indices...`
          );
          await this.dictionary.prefetchAllIndices();

          this.logger.info(scope('Server'), `prefetching library indices...`);
          await this.library.prefetchAllIndices();

          this.logger.info(scope('Server'), `prefetching Polly voices...`);
          await this.polly.prefetchAllVoiceList();

          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public start(): void {
    const app = express();
    app.set('view engine', 'pug');
    app.set('views', path.join(appRoot.toString(), 'src', 'web', 'views'));

    app.use(this.authenticator.createAuthenticationHandler());

    app.use(
      express.static(
        path.join(appRoot.toString(), 'public', this.env.PUBLIC_FOLDER_NAME)
      )
    );
    app.use(express.static(path.join(appRoot.toString(), 'public', 'common')));

    app.use(
      '/',
      this.webRouterFactory.make(this.webControllerFactory.makeControllers())
    );

    app.use(
      '/api/v1',
      this.apiRouterFactory.make(this.apiControllerFactory.makeControllers())
    );

    app.listen(
      8082,
      (): void =>
        this.logger.info(
          scope('Server'),
          `listening on port ${chalk.bold.white.bgBlue(' 8082 ')}!`
        )
    );
  }
}
