/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export class BaseTransformer {
  // Tranform the coordinates from top left origin to the new origin
  public static transformBase(
    newOrigin: { x: number; y: number },
    vector: { x: number; y: number }
  ): { x: number; y: number } {
    return {
      x: vector.x - newOrigin.x,
      y: -(vector.y - newOrigin.y),
    };
  }

  // Tranform the coordinates back from the current origin to top left centerOrigin
  public static reverseTransform(
    currentOrigin: { x: number; y: number },
    vector: { x: number; y: number }
  ): { x: number; y: number } {
    return {
      x: vector.x + currentOrigin.x,
      y: -(vector.y - currentOrigin.y),
    };
  }
}
