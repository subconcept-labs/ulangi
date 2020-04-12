/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

import { AuthenticatorFacade } from '../facades/AuthenticatorFacade';
import { parserErrorHandler } from '../middlewares/parserErrorHandler';
import { ApiRequest } from './ApiRequest';
import { ApiResponse } from './ApiResponse';
import { ApiController } from './controllers/ApiController';

export class ApiRouterFactory {
  private authenticator: AuthenticatorFacade;

  public constructor(authenticator: AuthenticatorFacade) {
    this.authenticator = authenticator;
  }

  public make(controllers: readonly ApiController<any, any>[]): express.Router {
    const router = express.Router();
    router.use(cors({ origin: 'true' }));
    router.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
    router.use(bodyParser.json({ limit: '5mb' }));
    router.use(parserErrorHandler);

    this.connectControllersToRouter(controllers, router);

    return router;
  }

  private connectControllersToRouter(
    controllers: readonly ApiController<any, any>[],
    router: express.Router
  ): void {
    controllers.forEach(
      (controller): void => {
        const options = controller.options();

        options.paths.forEach(
          (path): void => {
            const requestHandler = (
              _req: express.Request,
              _res: express.Response
            ): Promise<void> => {
              const req = new ApiRequest<any>(_req, options.requestResolver);
              const res = new ApiResponse<any>(_res);

              return new Promise(
                async (resolve): Promise<void> => {
                  try {
                    if (!req.isRequestValid()) {
                      res.error(400, {
                        errorCode: ErrorCode.GENERAL__INVALID_REQUEST,
                      });
                    } else {
                      await controller.handleRequest(req, res);
                    }
                  } catch (error) {
                    console.log(error)
                    if (res.headersSent() === false) {
                      res.error(500, {
                        errorCode: ErrorCode.GENERAL__SERVER_ERROR,
                      });
                    }
                  }

                  resolve();
                }
              );
            };

            const allowedMethod: 'get' | 'post' = options.allowedMethod;

            if (options.authStrategies !== null) {
              if (options.authStrategies.length === 0) {
                throw new Error(
                  'authStrategies cannot be empty. Please specify at least one strategy.'
                );
              } else {
                router[allowedMethod](
                  path,
                  this.authenticator.createAuthenticationMiddleware(
                    options.authStrategies
                  ),
                  requestHandler
                );
              }
            } else {
              router[allowedMethod](path, requestHandler);
            }
          }
        );
      }
    );
  }
}
