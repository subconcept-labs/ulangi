/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  ErrorCode,
  UserMembership,
  UserStatus,
} from '@ulangi/ulangi-common/enums';
import {
  SignUpRequest,
  SignUpResponse,
} from '@ulangi/ulangi-common/interfaces';
import { SignUpRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { DatabaseFacade, UserModel } from '@ulangi/ulangi-remote-database';
import * as moment from 'moment';
import * as uuid from 'uuid';

import { AuthenticatorFacade } from '../../facades/AuthenticatorFacade';
import { Config } from '../../interfaces/Config';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class SignUpController extends ApiController<
  SignUpRequest,
  SignUpResponse
> {
  private authenticator: AuthenticatorFacade;
  private database: DatabaseFacade;
  private userModel: UserModel;
  private config: Config;

  public constructor(
    authenticator: AuthenticatorFacade,
    database: DatabaseFacade,
    userModel: UserModel,
    config: Config
  ) {
    super();
    this.authenticator = authenticator;
    this.database = database;
    this.userModel = userModel;
    this.config = config;
  }

  public options(): ControllerOptions<SignUpRequest> {
    return {
      paths: ['/sign-up'],
      allowedMethod: 'post',
      authStrategies: null,
      requestResolver: new SignUpRequestResolver(
        this.config.user.passwordMinLength
      ),
    };
  }

  public async handleRequest(
    req: ApiRequest<SignUpRequest>,
    res: ApiResponse<SignUpResponse>
  ): Promise<void> {
    const { email, password } = req.body;

    const userId = uuid.v4();
    const accessKey = uuid.v4();
    const db = this.database.getDb('auth');

    const { errorCode } = await db.transaction(
      (tx): Promise<{ errorCode: null | string }> => {
        return new Promise(
          async (resolve, reject): Promise<void> => {
            try {
              const existed = await this.userModel.emailExists(tx, email);
              if (existed) {
                resolve({
                  errorCode: ErrorCode.USER__EMAIL_ALREADY_REGISTERED,
                });
              } else {
                const encryptedPassword = await this.authenticator.encryptPassword(
                  password,
                  this.config.user.passwordEncryptionSaltRounds
                );

                const shardId = this.database.getRandomShardId();

                await this.userModel.insertUser(
                  tx,
                  {
                    userId,
                    email,
                    userStatus: UserStatus.ACTIVE,
                    membership: UserMembership.REGULAR,
                    membershipExpiredAt: null,
                    createdAt: moment().toDate(),
                    updatedAt: moment().toDate(),
                    firstSyncedAt: null,
                    lastSyncedAt: null,
                    extraData: [],
                  },
                  shardId,
                  encryptedPassword,
                  accessKey
                );
                resolve({ errorCode: null });
              }
            } catch (error) {
              reject(error);
            }
          }
        );
      }
    );

    if (errorCode !== null) {
      res.error(400, { errorCode });
    } else {
      const { user } = assertExists(
        await this.userModel.getUserById(db, userId, true)
      );
      const accessToken = this.authenticator.createAccessToken(
        userId,
        accessKey
      );

      res.json({ currentUser: user, accessToken });
    }
  }
}
