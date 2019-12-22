/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { IapService } from '@ulangi/ulangi-common/enums';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { PurchaseRowPreparer } from './PurchaseRowPreparer';

describe('PurchaseRowPreparer', (): void => {
  let purchaseRowPreparer: PurchaseRowPreparer;
  let resetCurrentTime: () => void;

  beforeEach(
    (): void => {
      purchaseRowPreparer = new PurchaseRowPreparer();
      resetCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      resetCurrentTime();
    }
  );

  test('prepare row for insert correctly', (): void => {
    const preparedRow = purchaseRowPreparer.prepareInsert('userId', {
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

    expect(preparedRow).toEqual({
      transactionId: 'transactionId',
      service: IapService.APPLE,
      userId: 'userId',
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

  test('allow originalTransactionId, originalPurchaseDate, cancellationDate, and expirationDate to be null when prepare for insert', (): void => {
    const preparedRow = purchaseRowPreparer.prepareInsert('userId', {
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

    expect(preparedRow).toEqual({
      transactionId: 'transactionId',
      service: IapService.APPLE,
      userId: 'userId',
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

  test('can prepare row for insert', (): void => {
    const result = purchaseRowPreparer.canPrepareInsert('userId', {
      transactionId: 'transactionId',
      service: IapService.GOOGLE,
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

    expect(result).toEqual(true);
  });

  test('prepare row for update correctly', (): void => {
    const preparedRow = purchaseRowPreparer.prepareUpdate('userId', {
      transactionId: 'transactionId',
      service: IapService.GOOGLE,
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

    expect(preparedRow).toEqual({
      transactionId: 'transactionId',
      service: IapService.GOOGLE,
      userId: 'userId',
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

  test('allow originalTransactionId, originalPurchaseDate, cancellationDate, and expirationDate to be null when prepare for update', (): void => {
    const preparedRow = purchaseRowPreparer.prepareUpdate('userId', {
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

    expect(preparedRow).toEqual({
      transactionId: 'transactionId',
      service: IapService.APPLE,
      userId: 'userId',
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
