/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SetStatus } from '@ulangi/ulangi-common/enums';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';

import { SetRowPreparer } from './SetRowPreparer';

describe('SetRowPreparer', (): void => {
  let setRowPreparer: SetRowPreparer;
  let resetCurrentTime: () => void;

  beforeEach(
    (): void => {
      setRowPreparer = new SetRowPreparer();
      resetCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      resetCurrentTime();
    }
  );

  test('prepare row for insert correctly', (): void => {
    const preparedRow = setRowPreparer.prepareInsert('userId', {
      setId: 'setId',
      setName: 'setName',
      setStatus: SetStatus.ACTIVE,
      learningLanguageCode: 'en',
      translatedToLanguageCode: 'vi',
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      updatedStatusAt: moment()
        .subtract(3, 'hours')
        .toDate(),
    });

    expect(preparedRow).toEqual({
      userId: 'userId',
      setId: 'setId',
      setName: 'setName',
      setStatus: SetStatus.ACTIVE,
      learningLanguageCode: 'en',
      translatedToLanguageCode: 'vi',
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      updatedStatusAt: moment()
        .subtract(3, 'hours')
        .toDate(),
    });
  });

  test('prepare row for insert fails because setName is empty', (): void => {
    expect(
      (): void => {
        setRowPreparer.prepareInsert('userId', {
          setId: 'setId',
          setName: '',
          setStatus: SetStatus.ACTIVE,
          learningLanguageCode: 'en',
          translatedToLanguageCode: 'vi',
          createdAt: moment()
            .subtract(1, 'hours')
            .toDate(),
          updatedAt: moment()
            .subtract(2, 'hours')
            .toDate(),
          updatedStatusAt: moment()
            .subtract(3, 'hours')
            .toDate(),
        });
      }
    ).toThrowWithMessage(Error, /setName/);
  });

  test('can prepare row for insert', (): void => {
    const result = setRowPreparer.canPrepareInsert('userId', {
      setId: 'setId',
      setName: 'setName',
      setStatus: SetStatus.ACTIVE,
      learningLanguageCode: 'en',
      translatedToLanguageCode: 'vi',
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      updatedStatusAt: moment()
        .subtract(3, 'hours')
        .toDate(),
    });

    expect(result).toEqual(true);
  });

  test('cannot prepare row becuase setName is empty', (): void => {
    const result = setRowPreparer.canPrepareInsert('userId', {
      setId: 'setId',
      setName: '',
      setStatus: SetStatus.ACTIVE,
      learningLanguageCode: 'en',
      translatedToLanguageCode: 'vi',
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      updatedStatusAt: moment()
        .subtract(3, 'hours')
        .toDate(),
    });

    expect(result).toEqual(false);
  });

  test('prepare row for update correctly', (): void => {
    const preparedRow = setRowPreparer.prepareUpdate('userId', {
      setId: 'setId',
      setName: 'setName',
      setStatus: SetStatus.ACTIVE,
      learningLanguageCode: 'en',
      translatedToLanguageCode: 'vi',
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      updatedStatusAt: moment()
        .subtract(3, 'hours')
        .toDate(),
    });

    expect(preparedRow).toEqual({
      userId: 'userId',
      setId: 'setId',
      setName: 'setName',
      setStatus: SetStatus.ACTIVE,
      learningLanguageCode: 'en',
      translatedToLanguageCode: 'vi',
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      updatedStatusAt: moment()
        .subtract(3, 'hours')
        .toDate(),
    });
  });

  test('prepare row for update fails because setName is empty', (): void => {
    expect(
      (): void => {
        setRowPreparer.prepareUpdate('userId', {
          setId: 'setId',
          setName: '',
          setStatus: SetStatus.ACTIVE,
          learningLanguageCode: 'en',
          translatedToLanguageCode: 'vi',
          createdAt: moment()
            .subtract(1, 'hours')
            .toDate(),
          updatedAt: moment()
            .subtract(2, 'hours')
            .toDate(),
          updatedStatusAt: moment()
            .subtract(3, 'hours')
            .toDate(),
        });
      }
    ).toThrowWithMessage(Error, /setName/);
  });

  test('can prepare row for update when row is valid', (): void => {
    const result = setRowPreparer.canPrepareUpdate('userId', {
      setId: 'setId',
      setName: 'setName',
      setStatus: SetStatus.ACTIVE,
      learningLanguageCode: 'en',
      translatedToLanguageCode: 'vi',
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      updatedStatusAt: moment()
        .subtract(3, 'hours')
        .toDate(),
    });

    expect(result).toEqual(true);
  });

  test('cannot prepare row for update because setName is empty', (): void => {
    const result = setRowPreparer.canPrepareUpdate('userId', {
      setId: 'setId',
      setName: '',
      setStatus: SetStatus.ACTIVE,
      learningLanguageCode: 'en',
      translatedToLanguageCode: 'vi',
      createdAt: moment()
        .subtract(1, 'hours')
        .toDate(),
      updatedAt: moment()
        .subtract(2, 'hours')
        .toDate(),
      updatedStatusAt: moment()
        .subtract(3, 'hours')
        .toDate(),
    });

    expect(result).toEqual(false);
  });
});
