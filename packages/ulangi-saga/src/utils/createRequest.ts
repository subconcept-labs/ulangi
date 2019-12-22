/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request } from '@ulangi/ulangi-common/interfaces';
import { AxiosRequestConfig } from 'axios';
import * as _ from 'lodash';

export function createRequest<T extends Request>(
  method: T['method'],
  baseUrl: string,
  path: T['path'],
  query: T['query'],
  body: T['body'],
  authPayload: T['authRequired'] extends true
    ?
        | { accessToken: string }
        | { apiKey: string }
        | { email: string; password: string }
    : null
): AxiosRequestConfig {
  const requestConfig: {
    [P in keyof AxiosRequestConfig]: AxiosRequestConfig[P]
  } = {
    url: baseUrl + path,
    method,
  };

  if (query !== null) {
    requestConfig.params = query;
  }

  if (body !== null) {
    requestConfig.data = body;
  }

  const headers: { [P in string]: string } = {};

  if (authPayload !== null) {
    if (_.has(authPayload, 'accessToken')) {
      headers['Authorization'] = 'Bearer ' + _.get(authPayload, 'accessToken');
    } else if (_.has(authPayload, 'apiKey')) {
      headers['Authorization'] = 'Bearer ' + _.get(authPayload, 'apiKey');
    } else if (_.has(authPayload, 'email') && _.has(authPayload, 'password')) {
      requestConfig.data = {
        ...requestConfig.data,
        email: _.get(authPayload, 'email'),
        password: _.get(authPayload, 'password'),
      };
    }
  }

  if (!_.isEmpty(headers)) {
    requestConfig.headers = headers;
  }

  return requestConfig;
}
