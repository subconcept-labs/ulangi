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
import { WebControllerFactory } from './web/WebControllerFactory';
import { WebRouterFactory } from './web/WebRouterFactory';

export class Server {
  private logger: Logger;
  private config: Config;
  private env: Env;
  private authenticator: AuthenticatorFacade;
  private database: DatabaseFacade;
  private remoteConfig: RemoteConfigFacade;
  private modelList: ModelList;

  // Optional services
  private awsConfig: null | AWS.Config;
  private firebase: null | FirebaseFacade;
  private dictionary: null | DictionaryFacade;
  private library: null | LibraryFacade;
  private googleTranslate: null | GoogleTranslateAdapter;
  private googleTextToSpeech: null | GoogleTextToSpeechAdapter;
  private polly: null | PollyAdapter;
  private iap: null | IapAdapter;
  private mailer: null | MailerAdapter;
  private imageUploader: null | ImageUploaderAdapter;

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

    this.remoteConfig = new RemoteConfigFacade();

    this.authenticator = new AuthenticatorFacade(
      new passport.Passport(),
      this.database,
      this.modelList.userModel,
      this.modelList.resetPasswordModel,
      this.modelList.apiKeyModel,
      this.env.JWT_SECRET_KEY
    );

    this.awsConfig =
      this.env.AWS_ACCESS_KEY_ID &&
      this.env.AWS_SECRET_ACCESS_KEY &&
      this.env.AWS_DEFAULT_REGION
        ? new AWS.Config({
            credentials: new AWS.Credentials(
              this.env.AWS_ACCESS_KEY_ID,
              this.env.AWS_SECRET_ACCESS_KEY
            ),
            region: this.env.AWS_DEFAULT_REGION,
          })
        : null;

    this.firebase =
      typeof this.env.FIREBASE_SERVICE_ACCOUNT_PATH !== 'undefined' &&
      typeof this.env.FIREBASE_DATABASE_URL !== 'undefined'
        ? new FirebaseFacade(
            this.env.FIREBASE_SERVICE_ACCOUNT_PATH,
            this.env.FIREBASE_DATABASE_URL,
            this.modelList.userModel,
            this.modelList.setModel,
            this.modelList.vocabularyModel
          )
        : null;

    this.dictionary =
      typeof this.env.DICTIONARY_SERVER_URL !== 'undefined'
        ? new DictionaryFacade(this.env.DICTIONARY_SERVER_URL, AWS.config)
        : null;

    this.library =
      typeof this.env.LIBRARY_SERVER_URL !== 'undefined' &&
      this.dictionary !== null
        ? new LibraryFacade(
            this.env.LIBRARY_SERVER_URL,
            this.dictionary,
            AWS.config
          )
        : null;

    this.googleTranslate =
      typeof this.env.GOOGLE_CLOUD_PROJECT_ID !== 'undefined' &&
      typeof this.env.GOOGLE_CLOUD_SERVICE_ACCOUNT !== 'undefined'
        ? new GoogleTranslateAdapter(
            this.env.GOOGLE_CLOUD_PROJECT_ID,
            this.env.GOOGLE_CLOUD_SERVICE_ACCOUNT
          )
        : null;

    this.googleTextToSpeech =
      typeof this.env.GOOGLE_CLOUD_PROJECT_ID !== 'undefined' &&
      typeof this.env.GOOGLE_CLOUD_SERVICE_ACCOUNT !== 'undefined'
        ? new GoogleTextToSpeechAdapter(
            this.env.GOOGLE_CLOUD_PROJECT_ID,
            this.env.GOOGLE_CLOUD_SERVICE_ACCOUNT
          )
        : null;

    this.iap =
      typeof this.env.PLAY_STORE_SERVICE_ACCOUNT !== 'undefined' &&
      typeof this.env.IOS_PREMIUM_LIFETIME_PRODUCT_ID !== 'undefined' &&
      typeof this.env.ANDROID_PREMIUM_LIFETIME_PRODUCT_ID !== 'undefined'
        ? new IapAdapter(
            this.modelList.userModel,
            this.modelList.purchaseModel,
            this.env.PLAY_STORE_SERVICE_ACCOUNT,
            this.env.IOS_PREMIUM_LIFETIME_PRODUCT_ID,
            this.env.ANDROID_PREMIUM_LIFETIME_PRODUCT_ID
          )
        : null;

    this.mailer =
      typeof this.env.AWS_SES_REGION !== 'undefined'
        ? new MailerAdapter(new AWS.SES({ region: this.env.AWS_SES_REGION }))
        : null;

    this.polly =
      typeof this.env.AWS_POLLY_REGION !== 'undefined'
        ? new PollyAdapter(new AWS.Polly({ region: this.env.AWS_POLLY_REGION }))
        : null;

    this.imageUploader =
      this.awsConfig !== null ? new ImageUploaderAdapter(new AWS.S3()) : null;

    this.apiControllerFactory = new ApiControllerFactory(
      this.authenticator,
      this.database,
      this.remoteConfig,
      this.modelList,
      this.env,
      this.config,
      this.firebase,
      this.dictionary,
      this.library,
      this.googleTranslate,
      this.googleTextToSpeech,
      this.mailer,
      this.iap,
      this.imageUploader
    );
    this.apiRouterFactory = new ApiRouterFactory(this.authenticator);

    this.webControllerFactory = new WebControllerFactory(this.env);
    this.webRouterFactory = new WebRouterFactory();
  }

  public async setup(): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          if (this.awsConfig === null) {
            this.handleServiceDisabled('AWS is not configured.');
          } else {
            AWS.config.update(this.awsConfig);
            this.handleServiceEnabled('AWS is configured.');
          }

          await this.database.checkAuthDatabaseTables();
          this.handleServiceEnabled('Auth database is connected successfully.');

          await this.database.checkAllShardDatabaseTables();
          this.handleServiceEnabled(
            'Shard databases are connected successfully.'
          );

          if (this.iap === null) {
            this.handleServiceDisabled('In-app purchase is not configured.');
          } else {
            await this.iap.setup();
            this.handleServiceEnabled('In-app purchase is set up.');
          }

          if (this.googleTranslate === null) {
            this.handleServiceDisabled('Google Translate is not configured.');
          } else {
            await this.googleTranslate.checkTranslators();
            this.handleServiceEnabled('Google Translate is set up correctly.');
          }

          if (this.googleTextToSpeech === null) {
            this.handleServiceDisabled('Google TTS is not configured.');
          } else {
            await this.googleTextToSpeech.checkSynthesizeSpeech();
            this.handleServiceEnabled('Google TTS is set up correctly.');
          }

          if (this.polly === null) {
            this.handleServiceDisabled('Polly is not configured.');
          } else {
            await this.polly.prefetchAllVoiceList();
            this.handleServiceEnabled(`Polly is set up correctly.`);
          }

          if (this.dictionary === null) {
            this.handleServiceDisabled('Dictionary is not configured.');
          } else {
            await this.dictionary.prefetchAllIndices();
            this.handleServiceEnabled('Dictionary is set up correctly.');
          }

          if (this.library === null) {
            this.handleServiceDisabled('Library is not configured.');
          } else {
            await this.library.prefetchAllIndices();
            this.handleServiceEnabled(`Library is set up correctly.`);
          }

          if (this.mailer === null) {
            this.handleServiceDisabled('Mailer is not configured.');
          }

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

    if (typeof this.env.PUBLIC_FOLDER_NAME !== 'undefined') {
      app.use(
        express.static(
          path.join(appRoot.toString(), 'public', this.env.PUBLIC_FOLDER_NAME)
        )
      );
    }

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
          `Server is listening on port ${chalk.bold.white.bgBlue(' 8082 ')}!`
        )
    );
  }

  private handleServiceDisabled(message: string): void {
    if (this.env.ALERT_SERVICE_DISABLED === 'warn') {
      this.logger.warn(scope('Server'), message);
    } else if (this.env.ALERT_SERVICE_DISABLED === 'error') {
      throw new Error(message);
    }
  }

  private handleServiceEnabled(message: string): void {
    this.logger.info(scope('Server'), message);
  }
}
