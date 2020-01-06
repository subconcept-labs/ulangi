/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  ProcessPurchaseRequest,
  ProcessPurchaseResponse,
} from '@ulangi/ulangi-common/interfaces';
import { ProcessPurchaseRequestResolver } from '@ulangi/ulangi-common/resolvers';
import { DatabaseFacade, PurchaseModel } from '@ulangi/ulangi-remote-database';
import * as _ from 'lodash';

import { IapAdapter } from '../../adapters/IapAdapter';
import { AuthenticationStrategy } from '../../enums/AuthenticationStrategy';
import { FirebaseFacade } from '../../facades/FirebaseFacade';
import { ControllerOptions } from '../../interfaces/ControllerOptions';
import { ApiRequest } from '../ApiRequest';
import { ApiResponse } from '../ApiResponse';
import { ApiController } from './ApiController';

export class ProcessPurchaseController extends ApiController<
  ProcessPurchaseRequest,
  ProcessPurchaseResponse
> {
  private iap: IapAdapter;
  private database: DatabaseFacade;
  private firebase: null | FirebaseFacade;
  private purchaseModel: PurchaseModel;

  public constructor(
    iap: IapAdapter,
    database: DatabaseFacade,
    firebase: null | FirebaseFacade,
    purchaseModel: PurchaseModel
  ) {
    super();
    this.iap = iap;
    this.database = database;
    this.firebase = firebase;
    this.purchaseModel = purchaseModel;
  }

  public options(): ControllerOptions<ProcessPurchaseRequest> {
    return {
      paths: ['/process-purchase'],
      allowedMethod: 'post',
      authStrategies: [AuthenticationStrategy.ACCESS_TOKEN],
      requestResolver: new ProcessPurchaseRequestResolver(),
    };
  }

  public async handleRequest(
    req: ApiRequest<ProcessPurchaseRequest>,
    res: ApiResponse<ProcessPurchaseResponse>
  ): Promise<void> {
    const receipt = req.body.receipt;
    const userId = req.user.userId;

    try {
      const purchases = await this.iap.validateAndGetPurchases(receipt);

      if (purchases !== null && purchases.length > 0) {
        const authDb = this.database.getDb('auth');

        const result = await authDb.transaction(
          async (tx): Promise<ProcessPurchaseResponse> => {
            const purchasesAlreadyAppliedToOtherAccounts = await this.purchaseModel.getPurchasesAppliedToOtherAccounts(
              tx,
              userId,
              purchases
            );

            // Remove purchases that were already applied to other accounts
            const validPurchases = _.differenceBy(
              purchases,
              purchasesAlreadyAppliedToOtherAccounts,
              'transactionId'
            );

            const {
              purchasesSuccessfullyApplied,
              purchasesAlreadyApplied,
            } = await this.iap.applyPremiumLifetimePurchases(
              tx,
              req.user,
              validPurchases
            );

            return Promise.resolve({
              purchasesSuccessfullyApplied,
              purchasesAlreadyApplied,
              purchasesAlreadyAppliedToOtherAccounts,
            });
          }
        );

        res.json(result);

        if (
          result.purchasesSuccessfullyApplied.length > 0 &&
          this.firebase !== null
        ) {
          await this.firebase.notifyUserChange(authDb, userId);
        }
      } else {
        res.error(400, { errorCode: ErrorCode.IAP__NO_PURCHASES });
      }
    } catch (error) {
      res.error(400, { errorCode: ErrorCode.IAP__INVALID_RECEIPT });
    }
  }
}
