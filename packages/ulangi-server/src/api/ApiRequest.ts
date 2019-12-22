/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Request, User } from '@ulangi/ulangi-common/interfaces';
import { RequestResolver, UserResolver } from '@ulangi/ulangi-common/resolvers';
import * as express from 'express';

export class ApiRequest<T extends Request> {
  private userResolver = new UserResolver();

  private req: express.Request;
  private requestResolver: null | RequestResolver<T>;

  public constructor(
    req: express.Request,
    requestResolver: null | RequestResolver<T>
  ) {
    this.req = req;
    this.requestResolver = requestResolver;
  }

  public isAuthenticated(): boolean {
    return typeof this.req.user !== 'undefined' && this.req.user !== null;
  }

  public isRequestValid(): boolean {
    if (this.requestResolver !== null) {
      return this.requestResolver.isValid(this.req, true);
    } else {
      return true;
    }
  }

  public get body(): T['body'] {
    if (this.requestResolver !== null) {
      return this.requestResolver.resolve(this.req, true).body;
    } else {
      throw new Error(
        'Cannot resolve body because requestResolver is missing!'
      );
    }
  }

  public get query(): T['query'] {
    if (this.requestResolver !== null) {
      return this.requestResolver.resolve(this.req, true).query;
    } else {
      throw new Error(
        'Cannot resolve body because requestResolver is missing!'
      );
    }
  }

  public get user(): User {
    if (this.isAuthenticated()) {
      return this.userResolver.resolve(this.req.user, true);
    } else {
      throw new Error('Cannot get user because User is not authenticated.');
    }
  }

  public get userShardId(): number {
    if (this.isAuthenticated()) {
      return assertExists(this.req.user).shardId;
    } else {
      throw new Error(
        'Cannot get user shard id because User is not isAuthenticated.'
      );
    }
  }

  public get userEncryptedPassword(): string {
    if (this.isAuthenticated()) {
      return assertExists(this.req.user).encryptedPassword;
    } else {
      throw new Error(
        'Cannot get user encrypted password because User is not isAuthenticated.'
      );
    }
  }
}
