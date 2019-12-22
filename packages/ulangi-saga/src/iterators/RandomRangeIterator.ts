/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ReadonlyTuple } from '@ulangi/extended-types';
import * as _ from 'lodash';

export class RandomRangeIterator {
  private ranges: ReadonlyTuple<number, number>[] = [];

  public setInitialRange(range: [number, number]): void {
    this.ranges = [range];
  }

  public next(
    amount: number
  ): { value: readonly ReadonlyTuple<number, number>[]; done: boolean } {
    const randomRanges: ReadonlyTuple<number, number>[] = [];

    let count = 0;
    while (this.ranges.length > 0 && count < amount) {
      const range = this.pickRandomRange();
      // Split range if the difference is greater than 1
      if (range[1] - range[0] > 1) {
        const randomNumber = _.random(range[0] + 1, range[1] - 1);
        this.splitRange(randomNumber);
      }
      count++;
    }

    count = 0;
    while (this.ranges.length > 0 && count < amount) {
      // Pop the range to make sure the random ranges are not picked twice
      const randomRange = this.popRandomRange();
      randomRanges.push(randomRange);
      count++;
    }

    // Add back the ranges
    randomRanges.forEach(
      (range): void => {
        this.ranges.push(range);
      }
    );

    const done = this.ranges.length === 0 ? true : false;
    return { value: randomRanges, done };
  }

  public isDone(): boolean {
    return this.ranges.length === 0;
  }

  public removeOrShortenRangeFromLeft(num: number): void {
    const rangeIndex = this.findIndexOfRangeByNumberInBetween(num);
    if (rangeIndex !== -1) {
      const range = this.ranges[rangeIndex];
      // If num is equal to the end, then remove the range
      if (range[1] === num) {
        this.ranges.splice(rangeIndex, 1);
      }
      // Otherwise shorten it
      else {
        this.ranges.splice(rangeIndex, 1, [num + 1, range[1]]);
      }
    }
  }

  public removeExactRange(range: [number, number]): void {
    const index = this.findIndexOfExactRange(range);
    if (index !== -1) {
      this.ranges.splice(index, 1);
    }
  }

  private popRandomRange(): ReadonlyTuple<number, number> {
    const randomIndex = _.random(0, this.ranges.length - 1);
    const target = this.ranges[randomIndex];
    this.ranges.splice(randomIndex, 1);
    return target;
  }

  private pickRandomRange(): [number, number] {
    return this.ranges[_.random(0, this.ranges.length - 1)];
  }

  private splitRange(num: number): void {
    const index = this.findIndexOfRangeByNumberInBetween(num);
    if (index !== -1) {
      const range = this.ranges[index];
      if (num !== range[0] && num !== range[1]) {
        this.ranges.splice(index, 1, [range[0], num]);
        this.ranges.splice(index + 1, 0, [num + 1, range[1]]);
      }
    }
  }

  private findIndexOfRangeByNumberInBetween(num: number): number {
    return this.ranges.findIndex(
      (range): boolean => {
        return num >= range[0] && num <= range[1];
      }
    );
  }

  private findIndexOfExactRange(range: [number, number]): number {
    return this.ranges.findIndex(
      (tempRange): boolean => {
        return tempRange[0] === range[0] && tempRange[1] === range[1];
      }
    );
  }
}
