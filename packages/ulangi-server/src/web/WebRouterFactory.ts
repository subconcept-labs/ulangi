/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as express from 'express';

import { WebController } from './controllers/WebController';

export class WebRouterFactory {
  public make(controllers: readonly WebController[]): express.Router {
    const router = express.Router();

    this.connectControllersToRouter(controllers, router);

    return router;
  }

  private connectControllersToRouter(
    controllers: readonly WebController[],
    router: express.Router
  ): void {
    controllers.forEach(
      (controller): void => {
        const { paths, allowedMethod } = controller.options();

        paths.forEach(
          (path): void => {
            const requestHandler = async (
              req: any,
              res: any
            ): Promise<void> => {
              controller.handleRequest(req, res);
            };

            router[allowedMethod](path, requestHandler);
          }
        );
      }
    );
  }
}
