/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ApiScope } from '@ulangi/ulangi-common/enums';
import {
  ApiKeyModel,
  DatabaseFacade,
  ResetPasswordModel,
  UserModel,
} from '@ulangi/ulangi-remote-database';
import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import * as passportHttpBearer from 'passport-http-bearer';
import * as passportJWT from 'passport-jwt';
import * as passportLocal from 'passport-local';

import { AuthenticationStrategy } from '../enums/AuthenticationStrategy';
import { AccessTokenPayload } from '../interfaces/AccessTokenPayload';
import { AuthenticatedUser } from '../interfaces/AuthenticatedUser';
import { ResetPasswordTokenPayload } from '../interfaces/ResetPasswordTokenPayload';
import { AccessTokenPayloadResolver } from '../resolvers/AccessTokenPayloadResolver';
import { ResetPasswordTokenPayloadResolver } from '../resolvers/ResetPasswordTokenPayloadResolver';

export class AuthenticatorFacade {
  private accessTokenPayloadResolver = new AccessTokenPayloadResolver();
  private resetPasswordTokenPayloadResolver = new ResetPasswordTokenPayloadResolver();

  private passport: passport.Authenticator;
  private database: DatabaseFacade;
  private userModel: UserModel;
  private resetPasswordModel: ResetPasswordModel;
  private apiKeyModel: ApiKeyModel;
  private jwtSecretKey: string;

  public constructor(
    passport: passport.Authenticator,
    database: DatabaseFacade,
    userModel: UserModel,
    resetPasswordModel: ResetPasswordModel,
    apiKeyModel: ApiKeyModel,
    jwtSecretKey: string
  ) {
    this.passport = passport;
    this.database = database;
    this.userModel = userModel;
    this.resetPasswordModel = resetPasswordModel;
    this.apiKeyModel = apiKeyModel;
    this.jwtSecretKey = jwtSecretKey;
  }

  public createAuthenticationHandler(): express.Handler {
    this.passport.use(
      AuthenticationStrategy.ACCESS_TOKEN,
      this.authViaAccessTokenStrategy()
    );
    this.passport.use(
      AuthenticationStrategy.EMAIL_AND_PASSWORD,
      this.authViaEmailAndPasswordStrategy()
    );
    this.passport.use(
      AuthenticationStrategy.SYNC_API_KEY,
      this.authViaApiKeyStrategy(ApiScope.SYNC)
    );
    return this.passport.initialize();
  }

  public createAuthenticationMiddleware(
    strategies: readonly AuthenticationStrategy[]
  ): any {
    return this.passport.authenticate(strategies.slice(), { session: false });
  }

  public async verifyPassword(
    password: string,
    encryptedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, encryptedPassword);
  }

  public async encryptPassword(
    password: string,
    saltRounds: number
  ): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  public createAccessToken(userId: string, accessKey: string): string {
    return jwt.sign({ userId, accessKey }, this.jwtSecretKey);
  }

  public createResetPasswordToken(
    userId: string,
    resetPasswordKey: string
  ): string {
    return jwt.sign({ userId, resetPasswordKey }, this.jwtSecretKey);
  }

  public async isAccessTokenValid(accessToken: string): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          jwt.verify(
            accessToken,
            this.jwtSecretKey,
            async (error, decoded): Promise<void> => {
              if (error) {
                resolve(false);
              } else if (
                this.accessTokenPayloadResolver.canResolve(decoded, true)
              ) {
                const payload = this.accessTokenPayloadResolver.resolve(
                  decoded,
                  true
                );
                const valid = await this.isAccessTokenPayloadValid(payload);
                resolve(valid);
              } else {
                resolve(false);
              }
            }
          );
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public async isResetPasswordTokenValid(
    resetPasswordToken: string
  ): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          jwt.verify(
            resetPasswordToken,
            this.jwtSecretKey,
            async (error, decoded): Promise<void> => {
              if (error) {
                resolve(false);
              } else {
                if (
                  this.resetPasswordTokenPayloadResolver.canResolve(
                    decoded,
                    true
                  )
                ) {
                  const {
                    userId,
                    resetPasswordKey,
                  } = this.resetPasswordTokenPayloadResolver.resolve(
                    decoded,
                    true
                  );
                  const authDb = this.database.getDb('auth');
                  // Check if valid
                  const valid = await this.resetPasswordModel.isResetPasswordRequestValid(
                    authDb,
                    userId,
                    resetPasswordKey
                  );
                  resolve(valid);
                } else {
                  resolve(false);
                }
              }
            }
          );
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public decodeResetPasswordToken(
    resetPasswordToken: string
  ): ResetPasswordTokenPayload {
    return this.resetPasswordTokenPayloadResolver.resolve(
      jwt.decode(resetPasswordToken),
      true
    );
  }

  private async isAccessTokenPayloadValid(
    payload: AccessTokenPayload
  ): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await this.getAuthenticatedUserByAccessTokenPayload(
            payload
          );
          if (result === null) {
            resolve(false);
          } else {
            resolve(true);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  private authViaAccessTokenStrategy(): passport.Strategy {
    return new passportJWT.Strategy(
      {
        jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: this.jwtSecretKey,
      },
      async (payload, callback): Promise<void> => {
        const authedUser = await this.getAuthenticatedUserByAccessTokenPayload(
          payload
        );
        if (authedUser === null) {
          callback(null, false);
        } else {
          callback(null, authedUser);
        }
      }
    );
  }

  private authViaEmailAndPasswordStrategy(): passport.Strategy {
    return new passportLocal.Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
      },
      async (email, password, callback): Promise<void> => {
        const authedUser = await this.getAuthenticatedUserByEmailAndPassword(
          email,
          password
        );
        if (authedUser === null) {
          callback(null, false);
        } else {
          callback(null, authedUser);
        }
      }
    );
  }

  public authViaApiKeyStrategy(apiScope: ApiScope): passport.Strategy {
    return new passportHttpBearer.Strategy(
      async (apiKey, callback): Promise<void> => {
        const authedUser = await this.getAuthenticatedUserByApiKeyAndScope(
          apiKey,
          apiScope
        );
        if (authedUser === null) {
          callback(null, false);
        } else {
          callback(null, authedUser);
        }
      }
    );
  }

  private async getAuthenticatedUserByAccessTokenPayload(
    payload: AccessTokenPayload
  ): Promise<null | AuthenticatedUser> {
    return new Promise<null | AuthenticatedUser>(
      async (resolve, reject): Promise<void> => {
        try {
          const { userId, accessKey } = payload;
          const db = this.database.getDb('auth');
          const result = await this.userModel.getUserByIdAndAccessKey(
            db,
            userId,
            accessKey,
            true
          );

          if (result !== null) {
            const { user, shardId, password, accessKey } = result;
            resolve({
              ...user,
              shardId,
              encryptedPassword: password,
              accessKey,
            });
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  private async getAuthenticatedUserByEmailAndPassword(
    email: string,
    password: string
  ): Promise<null | AuthenticatedUser> {
    return new Promise<null | AuthenticatedUser>(
      async (resolve, reject): Promise<void> => {
        try {
          const db = this.database.getDb('auth');
          const result = await this.userModel.getUserByEmail(db, email, true);

          if (result !== null) {
            const {
              user,
              password: encryptedPassword,
              accessKey,
              shardId,
            } = result;
            const passwordCorrect = await this.verifyPassword(
              password,
              encryptedPassword
            );
            if (passwordCorrect === true) {
              resolve({
                ...user,
                encryptedPassword,
                accessKey,
                shardId,
              });
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }
  private async getAuthenticatedUserByApiKeyAndScope(
    apiKey: string,
    apiScope: ApiScope
  ): Promise<null | AuthenticatedUser> {
    return new Promise<null | AuthenticatedUser>(
      async (resolve, reject): Promise<void> => {
        try {
          const db = this.database.getDb('auth');
          const result = await this.apiKeyModel.getUserByApiKeyAndScope(
            db,
            apiKey,
            apiScope,
            true
          );

          if (result !== null) {
            const { user, shardId, password, accessKey } = result;
            resolve({
              ...user,
              shardId,
              encryptedPassword: password,
              accessKey,
            });
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
