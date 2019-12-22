/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ModSequenceStrategy } from '../../src/strategies/ModSequenceStrategy';

describe('ModSequenceStrategy', function(): void {
  let strategy: ModSequenceStrategy;
  let sequence: number[];
  let maxLevel: number;

  beforeEach(function(): void {
    strategy = new ModSequenceStrategy();
    maxLevel = 10;
  });

  it('should return correct sequence for position 0', function(): void {
    sequence = strategy.getLevelsByTermPosition(0, maxLevel);
    expect(sequence).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should return correct sequence for position 1', function(): void {
    sequence = strategy.getLevelsByTermPosition(1, maxLevel);
    expect(sequence).toEqual([1, 0, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should return correct sequence for position 2', function(): void {
    sequence = strategy.getLevelsByTermPosition(2, maxLevel);
    expect(sequence).toEqual([2, 1, 0, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should return correct sequence for position 3', function(): void {
    sequence = strategy.getLevelsByTermPosition(3, maxLevel);
    expect(sequence).toEqual([3, 1, 0, 2, 4, 5, 6, 7, 8, 9]);
  });

  it('should return correct sequence for position 4', function(): void {
    sequence = strategy.getLevelsByTermPosition(4, maxLevel);
    expect(sequence).toEqual([4, 2, 1, 0, 3, 5, 6, 7, 8, 9]);
  });

  it('should return correct sequence for position 5', function(): void {
    sequence = strategy.getLevelsByTermPosition(5, maxLevel);
    expect(sequence).toEqual([5, 1, 0, 2, 3, 4, 6, 7, 8, 9]);
  });

  it('should return correct sequence for position 6', function(): void {
    sequence = strategy.getLevelsByTermPosition(6, maxLevel);
    expect(sequence).toEqual([6, 3, 2, 1, 0, 4, 5, 7, 8, 9]);
  });

  it('should return correct sequence for position 7', function(): void {
    sequence = strategy.getLevelsByTermPosition(7, maxLevel);
    expect(sequence).toEqual([7, 1, 0, 2, 3, 4, 5, 6, 8, 9]);
  });

  it('should return correct sequence for position 8', function(): void {
    sequence = strategy.getLevelsByTermPosition(8, maxLevel);
    expect(sequence).toEqual([8, 4, 2, 1, 0, 3, 5, 6, 7, 9]);
  });

  it('should return correct sequence for position 9', function(): void {
    sequence = strategy.getLevelsByTermPosition(9, maxLevel);
    expect(sequence).toEqual([9, 3, 1, 0, 2, 4, 5, 6, 7, 8]);
  });
});
