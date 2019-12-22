/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { IapService } from '@ulangi/ulangi-common/enums';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { PurchasedItemConverter } from './PurchasedItemConverter';

describe('PurchaseRowPreparer', (): void => {
  let purchasedItemConverter: PurchasedItemConverter;
  let resetCurrentTime: () => void;

  beforeEach(
    (): void => {
      purchasedItemConverter = new PurchasedItemConverter();
      resetCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      resetCurrentTime();
    }
  );

  test('convert to purchase successfully when dates are timestamp', (): void => {
    const purchase = purchasedItemConverter.convertToPurchase(
      {
        transactionId: 'transactionId',
        productId: 'productId',
        purchaseDate: moment()
          .add(1, 'hours')
          .valueOf(),
        cancellationDate: moment()
          .add(2, 'hours')
          .valueOf(),
        expirationDate: moment()
          .add(3, 'hours')
          .valueOf(),
        quantity: 1,
        originalTransactionId: 'originalTransactionId',
        originalPurchaseDateMs: moment()
          .add(4, 'hours')
          .valueOf(),
      } as any,
      IapService.APPLE
    );

    expect(purchase).toEqual({
      transactionId: 'transactionId',
      service: IapService.APPLE,
      productId: 'productId',
      purchaseDate: moment()
        .add(1, 'hours')
        .toDate(),
      cancellationDate: moment()
        .add(2, 'hours')
        .toDate(),
      expirationDate: moment()
        .add(3, 'hours')
        .toDate(),
      quantity: 1,
      originalTransactionId: 'originalTransactionId',
      originalPurchaseDate: moment()
        .add(4, 'hours')
        .toDate(),
    });
  });

  test('convert to purchase successfully when some dates are string', (): void => {
    const purchase = purchasedItemConverter.convertToPurchase(
      {
        transactionId: 'transactionId',
        productId: 'productId',
        purchaseDate: moment()
          .add(1, 'hours')
          .format(),
        purchaseDateMs: moment()
          .add(2, 'hours')
          .valueOf(),
        cancellationDate: moment()
          .add(3, 'hours')
          .valueOf(),
        expirationDate: moment()
          .add(4, 'hours')
          .valueOf(),
        quantity: 1,
        originalTransactionId: 'originalTransactionId',
        originalPurchaseDate: moment()
          .add(5, 'hours')
          .valueOf(),
        originalPurchaseDateMs: moment()
          .add(6, 'hours')
          .valueOf(),
      } as any,
      IapService.APPLE
    );

    expect(purchase).toEqual({
      transactionId: 'transactionId',
      service: IapService.APPLE,
      productId: 'productId',
      purchaseDate: moment()
        .add(2, 'hours')
        .toDate(),
      cancellationDate: moment()
        .add(3, 'hours')
        .toDate(),
      expirationDate: moment()
        .add(4, 'hours')
        .toDate(),
      quantity: 1,
      originalTransactionId: 'originalTransactionId',
      originalPurchaseDate: moment()
        .add(6, 'hours')
        .toDate(),
    });
  });

  test('allow originalTransactionId, originalPurchaseDate, cancellationDate, and expirationDate to be optional when prepare for insert', (): void => {
    const preparedRow = purchasedItemConverter.convertToPurchase(
      {
        transactionId: 'transactionId',
        productId: 'productId',
        purchaseDate: moment()
          .add(1, 'hours')
          .valueOf(),
        quantity: 1,
        originalTransactionId: undefined,
        originalPurchaseDate: undefined,
        cancellationDate: undefined,
        expirationDate: undefined,
      },
      IapService.APPLE
    );

    expect(preparedRow).toEqual({
      transactionId: 'transactionId',
      service: IapService.APPLE,
      productId: 'productId',
      purchaseDate: moment()
        .add(1, 'hours')
        .toDate(),
      quantity: 1,
      cancellationDate: null,
      expirationDate: null,
      originalTransactionId: null,
      originalPurchaseDate: null,
    });
  });
});
